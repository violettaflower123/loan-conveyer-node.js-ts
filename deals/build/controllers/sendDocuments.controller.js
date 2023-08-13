import { ResourceNotFoundError } from "../errors/errorClasses.js";
import { MessageThemes, Status } from "../types/types.js";
import { sendKafkaMessage } from "../service/kafka.service.js";
import { getFromDb } from "../service/kafka.service.js";
import { logger } from "../helpers/logger.js";
import { updateApplication } from "../service/sendDocuments.service.js";
export const sendDocuments = async (req, res, next) => {
    try {
        const applicationId = req.params.applicationId;
        logger.info(`Processing documents for application ID: ${applicationId}`);
        const application = await getFromDb('application', applicationId);
        const creditId = application.credit_id;
        const clientId = JSON.parse(application.client_id);
        const client = await getFromDb('client', clientId);
        const credit = await getFromDb('credit', creditId);
        const payJson = JSON.parse(credit.payment_schedule);
        const clientJson = JSON.stringify(client);
        if (!application) {
            logger.warn(`Application not found for ID: ${applicationId}`);
            throw new ResourceNotFoundError('Application not found.');
        }
        updateApplication(applicationId, Status.DocumentCreated);
        const topic = 'send-documents';
        const message = {
            address: client.email,
            theme: MessageThemes.SendDocuments,
            applicationId: applicationId,
            name: client.first_name,
            lastName: client.last_name,
            paymentData: payJson,
            clientData: clientJson,
            creditId: credit.credit_id,
            amount: credit.amount,
            rate: credit.rate,
        };
        try {
            await sendKafkaMessage(topic, message);
        }
        catch (error) {
            console.error('Failed to send message:', error.message);
        }
        res.status(200).send('Success! Documents have been sent.');
    }
    catch (err) {
        const error = err;
        logger.error(`An error occurred while processing documents: ${error.message}`);
        next(error);
    }
};
//# sourceMappingURL=sendDocuments.controller.js.map