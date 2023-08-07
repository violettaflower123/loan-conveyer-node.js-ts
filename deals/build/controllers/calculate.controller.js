import axios from "axios";
import { ChangeType, Status, CreditStatus } from "../types/types.js";
import { getFromDb, createScoringDataDTO, saveCreditToDb, saveApplication, updateApplicationStatusAndHistory, updateClient, saveEmploymentToDb, updatePassport } from "../service/calculate.service.js";
import { ServerError, ResourceNotFoundError } from '../errors/errorClasses.js';
import { MessageThemes } from '../types/types.js';
import { sendMessage, producer } from "../service/kafka.service.js";
import { logger } from "../helpers/logger.js";
export const calculateCredit = async (req, res, next) => {
    try {
        const applicationId = req.params.applicationId;
        logger.info(`Processing application with ID: ${applicationId}`);
        const finishRegistrationData = req.body;
        logger.info('Received FinisiRegistrationData' + finishRegistrationData);
        const application = await getFromDb('application', applicationId);
        const clientId = JSON.parse(application.client_id);
        if (!application) {
            logger.warn(`Application not found for ID: ${applicationId}`);
            throw new ResourceNotFoundError('Application not found.');
        }
        const client = await getFromDb('client', clientId);
        if (!client) {
            logger.warn(`Client not found for ID: ${clientId}`);
            throw new ResourceNotFoundError('Client not found.');
        }
        const passport = await getFromDb('passport', client.passport_id);
        if (!passport) {
            logger.warn(`Passport not found for client ID: ${clientId}`);
            throw new ResourceNotFoundError('Passport not found.');
        }
        const scoringData = createScoringDataDTO(finishRegistrationData, application, client, passport);
        const scoringResponse = await axios.post('http://api-conveyer:3001/conveyor/calculation', scoringData);
        const creditDTO = scoringResponse.data;
        creditDTO.status = CreditStatus.Calculated;
        if (scoringResponse.status != 200) {
            logger.error(`Scoring failed for application ID: ${applicationId}`);
            await producer.connect();
            const message = {
                address: client.email,
                theme: MessageThemes.ApplicationDenied,
                applicationId: applicationId,
                name: client.first_name,
                lastName: client.last_name
            };
            sendMessage('application-denied', message);
            throw new ServerError('Scoring failed.');
        }
        const employmentId = await saveEmploymentToDb(scoringData.employment);
        await updateClient(clientId, scoringData.gender, scoringData.maritalStatus, scoringData.dependentNumber, employmentId, scoringData.account);
        const savedCredit = await saveCreditToDb(creditDTO);
        application.credit_id = savedCredit;
        application.application_id = applicationId;
        await updatePassport(scoringData.passportIssueBranch, scoringData.passportIssueDate, client.passport_id);
        await updateApplicationStatusAndHistory(application, Status.Approved, ChangeType.Automatic);
        await saveApplication(application);
        await producer.connect();
        const message = {
            address: client.email,
            theme: MessageThemes.CreateDocuments,
            applicationId: applicationId,
            name: client.first_name,
            lastName: client.last_name
        };
        sendMessage('create-documents', message);
        logger.info(`Application status updated successfully for ID: ${applicationId}`);
        return res.json({ message: 'Application status updated successfully.' });
    }
    catch (err) {
        logger.error('Ошибка: ' + err);
        next(err);
    }
};
//# sourceMappingURL=calculate.controller.js.map