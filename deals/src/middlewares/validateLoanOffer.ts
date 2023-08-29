import Joi, { CustomHelpers} from "joi";
import { BadRequestError } from "../errors/errorClasses.js";
import { Request, Response, NextFunction } from "express";

const loanOfferSchema = Joi.object({
    applicationId: Joi.string().uuid().required(),
    requestedAmount: Joi.number().min(10000).strict().required(),
    totalAmount: Joi.number().min(0).strict().required(),
    term: Joi.number().integer().strict().min(6).required(),
    monthlyPayment: Joi.number().min(0).strict().required(),
    rate: Joi.number().min(0).strict().required(),
    isInsuranceEnabled: Joi.boolean().strict().required(),
    isSalaryClient: Joi.boolean().strict().required(),
});

export const validateLoanOffer = (req: Request, res: Response, next: NextFunction) => {
    const { error } = loanOfferSchema.validate(req.body);

    if (error) {
        const errorMessage = error.details[0].message;
        const customError = new BadRequestError(errorMessage);
        return next(customError);
    }

    next();
};