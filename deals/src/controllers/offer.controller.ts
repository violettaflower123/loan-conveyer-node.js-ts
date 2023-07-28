import { Request, Response, NextFunction } from 'express';
import { LoanOfferDTO } from '../dtos.js';
import { db } from '../db.js';
import * as offerService from '../service/offer.service.js';
import { BadRequestError, ServerError, ConflictError, AuthorizationError, ValidationError, ResourceNotFoundError } from '../errors/errorClasses.js';



export const handleOfferUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loanOffer: LoanOfferDTO = req.body;
        const updatedApplication = await offerService.updateOffer(loanOffer);
        res.status(200).json(updatedApplication);
    } catch (err) {
        const error = err as Error;
        if (error instanceof BadRequestError) {
            return res.status(400).json({ error: error.message });
        } else if (error instanceof AuthorizationError) {
            return res.status(401).json({ error: error.message });
        } else if (error instanceof ValidationError) {
            return res.status(403).json({ error: error.message });
        } else if (error instanceof ResourceNotFoundError) {
            return res.status(404).json({ error: error.message });
        } else if (error instanceof ConflictError) {
            return res.status(409).json({ error: error.message });
        } else if (error instanceof ServerError) {
            return res.status(500).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "Unexpected error occurred" });
        }
    }
    // catch (err) {
    //     next(err);
    //     console.log('Error!!');
    //     const error = err as Error;
    //     return res.status(400).json({ error: error.message });
    // }

};