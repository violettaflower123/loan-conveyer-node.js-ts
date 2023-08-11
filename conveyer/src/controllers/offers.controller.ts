import { NextFunction, Request, Response } from "express";
import { LoanOfferDTO } from "../dtos.js";
import { calculateLoanOffers } from "../services/loanOffers.js";
import { logger } from "../helpers/logger.js";

export const createOffers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Creating loan offers');
        const loanOffers: LoanOfferDTO[] = calculateLoanOffers(req.body);
        logger.info('Calculated oan offers:', loanOffers);

        return res.json(loanOffers);  
    } catch (err) {
        logger.error('Error calculating loan offer', err); 
        return next(err); 
    }
}