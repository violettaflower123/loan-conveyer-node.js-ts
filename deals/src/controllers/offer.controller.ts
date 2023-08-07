import { Request, Response, NextFunction } from 'express';
import { LoanOfferDTO } from '../dtos.js';
import { db } from '../db.js';
import * as offerService from '../service/offer.service.js';
import { logger } from '../helpers/logger.js';



export const handleOfferUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loanOffer: LoanOfferDTO = req.body;
        logger.info(`Received LoanOffer: ${loanOffer}`);
        
        const updatedApplication = await offerService.updateOffer(loanOffer);
        res.status(200).json(updatedApplication);
    } catch (err) {
        logger.error(`Error updating offer: ${err}`);
        next(err);
    }

};