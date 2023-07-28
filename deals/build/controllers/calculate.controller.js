import axios from "axios";
import { ChangeType, Status, CreditStatus } from "../dtos.js";
import { getFromDb, createScoringDataDTO, saveCreditToDb, saveApplication, updateApplicationStatusAndHistory } from "../service/calculate.service.js";
import { BadRequestError, ServerError, ConflictError, AuthorizationError, ValidationError, ResourceNotFoundError } from '../errors/errorClasses.js';
export const calculateCredit = async (req, res, next) => {
    try {
        const applicationId = req.params.applicationId;
        const finishRegistrationData = req.body;
        const application = await getFromDb('application', applicationId);
        const clientId = JSON.parse(application.client_id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }
        const client = await getFromDb('client', clientId);
        if (!client) {
            throw new Error('Client not found.');
        }
        const passport = await getFromDb('passport', client.passport_id);
        if (!passport) {
            throw new Error('Passport not found.');
        }
        const scoringData = createScoringDataDTO(finishRegistrationData, application, client, passport);
        const scoringResponse = await axios.post('http://api-conveyer:3001/conveyor/calculation', scoringData);
        const creditDTO = scoringResponse.data;
        creditDTO.status = CreditStatus.Calculated;
        console.log('creditDTO', creditDTO);
        if (scoringResponse.status != 200) {
            return res.status(400).json({ message: 'Scoring failed.' });
        }
        const savedCredit = await saveCreditToDb(creditDTO);
        console.log('Saved Credit:', savedCredit);
        application.creditId = savedCredit;
        application.id = applicationId;
        await updateApplicationStatusAndHistory(application, Status.Approved, ChangeType.Automatic);
        console.log('Credit ID before saving application: ', application.creditId);
        await saveApplication(application);
        console.log('application', application);
        return res.json({ message: 'Application status updated successfully.' });
    }
    catch (err) {
        const error = err;
        if (error instanceof BadRequestError) {
            return res.status(400).json({ error: error.message });
        }
        else if (error instanceof AuthorizationError) {
            return res.status(401).json({ error: error.message });
        }
        else if (error instanceof ValidationError) {
            return res.status(403).json({ error: error.message });
        }
        else if (error instanceof ResourceNotFoundError) {
            return res.status(404).json({ error: error.message });
        }
        else if (error instanceof ConflictError) {
            return res.status(409).json({ error: error.message });
        }
        else if (error instanceof ServerError) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json({ error: "Unexpected error occurred" });
        }
    }
    // catch (err: any) {
    //     console.log('Error!!');
    //     next(err);
    //     const error = err as Error;
    //     if ('response' in err) {
    //         console.log(err.response.data);
    //         return res.status(400).json({ error: err.response.data });
    //     }
    //     return res.status(400).json({ error: error.message });
    // }
};
//# sourceMappingURL=calculate.controller.js.map