import Joi from "joi";
import { BadRequestError } from "../errors/errorClasses.js";
const validateNumber = (value, helpers) => {
    if (typeof value !== "number" || isNaN(value)) {
        return helpers.error("number.base");
    }
    return value;
};
const loanOfferSchema = Joi.object({
    applicationId: Joi.string().uuid().required(),
    requestedAmount: Joi.number().min(10000).custom(validateNumber).required(),
    totalAmount: Joi.number().min(0).custom(validateNumber).required(),
    term: Joi.number().integer().min(6).custom(validateNumber).required(),
    monthlyPayment: Joi.number().min(0).required(),
    rate: Joi.number().min(0).required(),
    isInsuranceEnabled: Joi.boolean().required(),
    isSalaryClient: Joi.boolean().required(),
});
export const validateLoanOffer = (req, res, next) => {
    const { error } = loanOfferSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0].message;
        const customError = new BadRequestError(errorMessage);
        return next(customError);
    }
    next();
};
//# sourceMappingURL=validateLoanOffer.js.map