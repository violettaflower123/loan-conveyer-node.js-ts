import Joi, { CustomHelpers} from "joi";
import { BadRequestError } from "../errors/errorClasses.js";
import { Request, Response, NextFunction } from "express";
import { logger } from "../helpers/logger.js";

const loanOfferSchema = Joi.object({
    applicationId: Joi.string().uuid().required(),
    requestedAmount: Joi.number().min(10000).required(),
    totalAmount: Joi.number().min(0).required(),
    term: Joi.number().integer().strict().min(6).required(),
    monthlyPayment: Joi.number().min(0).required(),
    rate: Joi.number().min(0).required(),
    isInsuranceEnabled: Joi.boolean().required(),
    isSalaryClient: Joi.boolean().required(),
});


export const validateLoanOffer = (req: Request, res: Response, next: NextFunction) => {
    logger.info('Получен запрос на валидацию кредитного предложения:', req.body);
    const { error } = loanOfferSchema.validate(req.body);

    if (error) {
        logger.warn('Ошибка валидации:', error);
        const errorMessage = error.details[0].message;
        const customError = new BadRequestError(errorMessage);
        return next(customError);
    }

    next();
};