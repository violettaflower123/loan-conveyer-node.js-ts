import { Request, Response } from "express";
import { ResourceNotFoundError, BadRequestError, ConflictError, ServerError, AuthorizationError, ValidationError } from "../errors/errorClasses.js";
import { EmailMessage } from "../dtos.js";
import { MessageThemes } from "../types/types.js";
import { sendMessage, producer } from "../service/kafka.service.js";
import { getFromDb } from "../service/kafka.service.js";
import { logger } from "../helpers/logger.js";

export const sendDocuments = async (req: Request, res: Response) => {
    try {
        const applicationId = req.params.applicationId;
        logger.info(`Processing documents for application ID: ${applicationId}`);

        const application = await getFromDb('application', applicationId);
        const creditId  = application.credit_id;
         const clientId = JSON.parse(application.client_id);
        const client = await getFromDb('client', clientId);
        const credit = await getFromDb('credit', creditId);
        const payJson = JSON.parse(credit.payment_schedule);
        const clientJson = JSON.stringify(client);
       
    
        if (!application) {
            logger.warn(`Application not found for ID: ${applicationId}`);
            throw new ResourceNotFoundError('Application not found.');
        }

        await producer.connect();

        const message: EmailMessage = {
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
        sendMessage('send-documents', message);

        res.status(200).send('Success! Documents have been sent.');
    } catch (err) {
        const error = err as Error;
        logger.error(`An error occurred while processing documents: ${error.message}`);

        if (error instanceof BadRequestError || 
            error instanceof ConflictError || 
            error instanceof ResourceNotFoundError || 
            error instanceof AuthorizationError || 
            error instanceof ValidationError || 
            error instanceof ServerError) {

            res.status(error.statusCode).send({
                message: error.message
            });
        } else {
            res.status(500).send({
                message: 'An unexpected error occurred.',
                error: error.message
            });
        }
    }
}


