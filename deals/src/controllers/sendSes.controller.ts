import { Request, Response } from "express";
import { Kafka } from "kafkajs";
import { EmailMessage } from "../dtos.js";
import { MessageThemes } from "../types/types.js";
import { BadRequestError, ServerError, ConflictError, AuthorizationError, ValidationError, ResourceNotFoundError } from "../errors/errorClasses.js";
import { sendMessage, producer } from "../service/kafka.service.js";
import { getFromDb } from "../service/kafka.service.js";
import { db } from "../db.js";
import { logger } from "../helpers/logger.js";

export const updateSesCode = async (applicationId: string, sesCode: string) => {
    try {
      await db.none('UPDATE application SET ses_code = $1 WHERE application_id = $2;', [sesCode, applicationId]);
    } catch (error) {
        logger.error('Error updating SES code:', error);
      throw error;
    }
}

function generateRandomNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}

export const sendSes = async (req: Request, res: Response) => {
    try {
        const applicationId = req.params.applicationId;
        logger.info(`Recieved request from application with ID: ${applicationId}`);

        const application = await getFromDb('application', applicationId);
        const clientId = JSON.parse(application.client_id);
        const client = await getFromDb('client', clientId);

        const sesCode = generateRandomNumber().toString();
        
        await updateSesCode(applicationId, sesCode);
        const application2 = await getFromDb('application', applicationId);
        logger.debug('Updated application:', application2);

        await producer.connect();

        const message: EmailMessage = {
          address: client.email,
          theme: MessageThemes.SendSes, 
          applicationId: applicationId,
          name: client.first_name,
          lastName: client.last_name, 
          sesCode: sesCode,
        };
        sendMessage('send-ses', message);

        res.status(200).send('Success! SES code has been sent.');
    } catch (err) {
        const error = err as Error;
        logger.error(`An error occurred while sending SES: ${error.message}`);

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