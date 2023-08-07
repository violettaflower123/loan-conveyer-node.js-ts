import { calculateCreditParameters } from "../services/scoreApplication.js";
import { performScoring } from "../services/scoreApplication.js";
// import { ScoringDataDTO } from "../dtos.js";
import { ValidationError, BadRequestError, AuthorizationError, ResourceNotFoundError, ConflictError, ServerError } from "../errors/errorClasses.js";
import { producer, sendMessage } from "../services/kafka.service.js";
import { MessageThemes } from "../types/types.js";
import { db } from "../db.js";
import { logger } from "../helpers/logger.js";
export const calculateLoanOffer = async (req, res) => {
    try {
        logger.info('Calculating loan offer');
        const scoringResult = performScoring(req.body);
        logger.info('Received a scoring result:', scoringResult);
        const clientData = await db.one('SELECT client.client_id, client.first_name, client.last_name FROM client INNER JOIN passport ON client.passport_id = passport.passport_id WHERE passport.series = $1 AND passport.number = $2', [req.body.passportSeries, req.body.passportNumber]);
        if (clientData.first_name !== req.body.firstName || clientData.last_name !== req.body.lastName) {
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
                const message = {
                    address: emailData.email,
                    theme: MessageThemes.ApplicationDenied,
                    name: req.body.firstName,
                    lastName: req.body.lastName
                };
                sendMessage('application-denied', message);
            }
            catch (error) {
                logger.error('Error calculating loan offer', error);
            }
            throw new BadRequestError(scoringResult.message);
        }
        const credit = calculateCreditParameters(req.body, scoringResult.rate);
        if (!credit) {
            logger.warn('The credit cannot be granted.');
            await producer.connect();
            const message = {
                address: emailData.email,
                theme: MessageThemes.ApplicationDenied,
                name: req.body.firstName,
                lastName: req.body.lastName
            };
            sendMessage('application-denied', message);
            return res.status(400).json({ message: 'The credit cannot be granted.' });
        }
        return res.json(credit);
    }
    catch (err) {
        logger.error('Error calculating loan offer', err);
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
};
//# sourceMappingURL=calculate.controller.js.map