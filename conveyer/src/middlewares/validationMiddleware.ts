import Joi, {ValidationResult} from "joi";
import { differenceInYears, isValid } from "date-fns";
import { BadRequestError } from "../errors/errorClasses.js";
import { LoanApplicationRequestDTO } from "../dtos.js";
import { Request, Response, NextFunction } from "express";

const schema = Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    middleName: Joi.string().min(2).max(30).optional(),
    amount: Joi.number().min(10000).required(),
    term: Joi.number().integer().min(6).required(), 
    birthdate: Joi.date().custom((value, helpers) => {
        const today = new Date();
        const age = differenceInYears(today, value);
        if (age < 18) return helpers.error('any.invalid');
        if (!isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }, 'Age validation').required(),
    email: Joi.string().email().pattern(/.+@.+\..+/).required(),
    passportSeries: Joi.string().length(4).pattern(/[0-9]{4}/).required(),
    passportNumber: Joi.string().length(6).pattern(/[0-9]{6}/).required()
});

export const validateLoanApplicationBody = (req: Request, res: Response, next: NextFunction) => {
    const { error }: ValidationResult<LoanApplicationRequestDTO> = schema.validate(req.body);

    if (error) {
        console.log(error.details); 
        throw new BadRequestError(error.details[0].message);
    }

    next();
};