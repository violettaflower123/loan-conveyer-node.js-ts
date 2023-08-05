import { calculateCreditParameters } from "../services/scoreApplication.js";
import { performScoring } from "../services/scoreApplication.js";
// import { ScoringDataDTO } from "../dtos.js";
import { ValidationError, BadRequestError, AuthorizationError, ResourceNotFoundError, ConflictError, ServerError } from "../errors/errorClasses.js";
import { producer, sendMessage } from "../services/kafka.service.js";
import { MessageThemes } from "../types/types.js";
import { db } from "../db.js";
export const calculateLoanOffer = async (req, res) => {
    try {
        const scoringResult = performScoring(req.body);
        const clientData = await db.one('SELECT client.client_id FROM client INNER JOIN passport ON client.passport_id = passport.passport_id WHERE passport.series = $1 AND passport.number = $2', [req.body.passportSeries, req.body.passportNumber]);
        const clientId = clientData.client_id;
        const emailData = await db.one('SELECT email FROM client WHERE client_id = $1', [clientId]);
        if (!scoringResult.passed) {
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
                console.log(error);
            }
            throw new BadRequestError(scoringResult.message);
        }
        const credit = calculateCreditParameters(req.body, scoringResult.rate);
        console.log('credit', credit);
        if (!credit) {
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