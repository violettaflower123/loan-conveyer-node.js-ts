import Joi from "joi";
import { differenceInYears, isValid } from "date-fns";
import { Gender, MaritalStatus, EmploymentStatus, Position } from "../types/types.js";
import { BadRequestError } from "../errors/errorClasses.js";
const validateNumber = (value, helpers) => {
    if (typeof value !== "number" || isNaN(value)) {
        return helpers.error("number.base");
    }
    return value;
};
export const scoringDataDTOSchema = Joi.object({
    amount: Joi.number().min(10000).custom(validateNumber).required(),
    term: Joi.number().integer().min(6).custom(validateNumber).required(),
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    middleName: Joi.string().min(2).max(30).required(),
    birthdate: Joi.date()
        .custom((value, helpers) => {
        const today = new Date();
        const age = differenceInYears(today, value);
        if (age < 18 || value > today || !isValid(value)) {
            return helpers.error("custom.birthdate");
        }
        return value;
    })
        .required()
        .messages({
        'custom.birthdate': 'Invalid birthdate. You must be at least 18 years old and the date must not be in the future.',
    }),
    passportSeries: Joi.string().length(4).pattern(/[0-9]{4}/).required(),
    passportNumber: Joi.string().length(6).pattern(/[0-9]{6}/).required(),
    gender: Joi.string().valid(...Object.values(Gender)).required(),
    passportIssueDate: Joi.date().iso()
        .custom((value, helpers) => {
        const today = new Date();
        if (value > today || !isValid(value)) {
            return helpers.error("custom.issueDate");
        }
        return value;
    })
        .required()
        .messages({
        'custom.issueDate': 'Invalid passport issue date. The date must not be in the future.',
    }),
    passportIssueBranch: Joi.string().required(),
    maritalStatus: Joi.string().valid(...Object.values(MaritalStatus)).required(),
    dependentNumber: Joi.number().custom(validateNumber).required(),
    employment: Joi.object({
        employmentStatus: Joi.string().valid(...Object.values(EmploymentStatus)).required(),
        employerINN: Joi.string().required(),
        salary: Joi.number().custom(validateNumber).required(),
        position: Joi.string().valid(...Object.values(Position)).required(),
        workExperienceTotal: Joi.number().custom(validateNumber).required(),
        workExperienceCurrent: Joi.number().custom(validateNumber).required(),
    }).required(),
    account: Joi.string().required(),
    isSalaryClient: Joi.boolean().required(),
    isInsuranceEnabled: Joi.boolean().required(),
});
export const validateScoringData = (req, res, next) => {
    const { error } = scoringDataDTOSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        console.log(error.details);
        throw new BadRequestError(error.details[0].message);
    }
    next();
};
//# sourceMappingURL=validateScoringData.js.map