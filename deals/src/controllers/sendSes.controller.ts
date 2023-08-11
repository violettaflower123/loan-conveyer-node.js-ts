import { NextFunction, Request, Response } from "express";
import { EmailMessage } from "../dtos.js";
import { MessageThemes } from "../types/types.js";
import { sendMessage, producer } from "../service/kafka.service.js";
import { getFromDb } from "../service/kafka.service.js";
import { logger } from "../helpers/logger.js";
import { updateSesCode, generateRandomNumber } from "../service/sendSes.servise.js";

export const sendSes = async (req: Request, res: Response, next: NextFunction) => {
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
        next(err);
    }



}