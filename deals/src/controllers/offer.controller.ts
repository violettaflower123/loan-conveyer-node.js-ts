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
        console.log(err);
        next(err);
    }

};