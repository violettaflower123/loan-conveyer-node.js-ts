import { Request, Response, NextFunction } from 'express';
import { LoanOfferDTO } from '../dtos.js';
import * as offerService from '../service/offer.service.js';
import { logger } from '../helpers/logger.js';
import { db } from '../db.js';
interface RequestWithJWT extends Request {
    email?: string;
}

export const handleOfferUpdate = async (req: RequestWithJWT, res: Response, next: NextFunction) => {
    try {
        const emailFromToken = req.email;
        if (!emailFromToken) {
            return res.status(401).send("Unauthorized");
        }

        const loanOffer: LoanOfferDTO = req.body;
        logger.info(`Received LoanOffer: ${loanOffer}`);

        const client = await db.oneOrNone('SELECT * FROM client WHERE email = $1', [emailFromToken]);
        if (!client) {
            logger.info(`Client not found: ${client}`);
            return res.status(403).send("Client not found");
        }
        const clientIdFromToken = client.client_id;

        const application = await db.one('SELECT * FROM application WHERE application_id = $1', [loanOffer.applicationId]);
        console.log('application with from token', application)

        if (Number(application.client_id) !== Number(clientIdFromToken)) {
            return res.status(403).send("You can only update your own application");
        }
        
        const updatedApplication = await offerService.updateOffer(loanOffer);
        res.status(200).json(updatedApplication);
    } catch (err) {
        logger.error(`Error updating offer: ${err}`);
        next(err);
    }

};