import { NextFunction, Request, Response } from "express";
import { calculateCreditParameters } from "../services/scoreApplication.js";
import { performScoring } from "../services/scoreApplication.js";
import { BadRequestError } from "../errors/errorClasses.js";
import { producer, sendMessage } from "../services/kafka.service.js";
import { EmailMessage } from "../dtos.js";
import { MessageThemes } from "../types/types.js";
import { db } from "../db.js";
import { logger } from "../helpers/logger.js";

export const calculateLoanOffer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Calculating loan offer');
        const scoringResult = performScoring(req.body);
        logger.info('Received a scoring result:', scoringResult);

        const clientData = await db.one('SELECT client.client_id, client.first_name, client.last_name FROM client INNER JOIN passport ON client.passport_id = passport.passport_id WHERE passport.series = $1 AND passport.number = $2', 
        [req.body.passportSeries, req.body.passportNumber]);

        if(clientData.first_name !== req.body.firstName || clientData.last_name !== req.body.lastName) {
            throw new BadRequestError('The provided first name and/or last name do not match our records.');
        }

        const clientId = clientData.client_id;
        const emailData = await db.one('SELECT email FROM client WHERE client_id = $1', [clientId]);

        if (!scoringResult.passed) {
            logger.warn('Scoring failed.');
            try {
                const clientData = await db.one('SELECT client.client_id FROM client INNER JOIN passport ON client.passport_id = passport.passport_id WHERE passport.series = $1 AND passport.number = $2', [req.body.passportSeries, req.body.passportNumber]);

                const clientId = clientData.client_id;
                const emailData = await db.one('SELECT email FROM client WHERE client_id = $1', [clientId]);

                await producer.connect();
                const message: EmailMessage = {
                  address: emailData.email,
                  theme: MessageThemes.ApplicationDenied, 
                  name: req.body.firstName,
                  lastName: req.body.lastName
                };
                sendMessage('application-denied', message);
            } catch (error) {
                logger.error('Error calculating loan offer', error); 
            }

            throw new BadRequestError(scoringResult.message);
        }
        const credit = calculateCreditParameters(req.body, scoringResult.rate);
    
        if (!credit) {
            logger.warn('The credit cannot be granted.'); 
            await producer.connect();
            const message: EmailMessage = {
              address: emailData.email,
              theme: MessageThemes.ApplicationDenied, 
              name: req.body.firstName,
              lastName: req.body.lastName
            };
            sendMessage('application-denied', message);

            return res.status(400).json({message: 'The credit cannot be granted.'});
        }
        return res.json(credit);
    } catch (err) {
        logger.error('Error calculating loan offer', err); 
        return next(err);
    }
    
}