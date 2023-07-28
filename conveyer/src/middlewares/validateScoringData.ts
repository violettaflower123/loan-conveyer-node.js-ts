import Joi, { ValidationResult, CustomHelpers } from "joi";
import { differenceInYears, isValid } from "date-fns";
import { Gender, MaritalStatus, EmploymentStatus, Position } from "../types/types.js";
import { Request, Response, NextFunction } from "express";
import { LoanApplicationRequestDTO } from "../dtos.js";
import { BadRequestError } from "../errors/errorClasses.js";

const validateNumber = (value: unknown, helpers: CustomHelpers) => {
  if (typeof value !== "number" || isNaN(value)) {
    return helpers.error("number.base");
  }
  return value;
};

const amountSchema = Joi.number().min(10000).custom(validateNumber).required();
const termSchema = Joi.number().integer().min(6).custom(validateNumber).required();
const dependentNumberSchema = Joi.number().custom(validateNumber).required();
const salarySchema = Joi.number().custom(validateNumber).required();
const workExperienceTotalSchema = Joi.number().custom(validateNumber).required();
const workExperienceCurrentSchema = Joi.number().custom(validateNumber).required();
const isSalaryClientSchema = Joi.boolean().required();
const isInsuranceEnabledSchema = Joi.boolean().required();

export const scoringDataDTOSchema = Joi.object({
  amount: amountSchema,
  term: termSchema,
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  middleName: Joi.string().min(2).max(30).required(),
  birthdate: Joi.date()
    .custom((value: Date, helpers: CustomHelpers) => {
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
    .custom((value: Date, helpers: CustomHelpers) => {
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
  dependentNumber: dependentNumberSchema,
  employment: Joi.object({
    employmentStatus: Joi.string().valid(...Object.values(EmploymentStatus)).required(),
    employerINN: Joi.string().required(),
    salary: salarySchema,
    position: Joi.string().valid(...Object.values(Position)).required(),
    workExperienceTotal: workExperienceTotalSchema,
    workExperienceCurrent: workExperienceCurrentSchema,
  }).required(),
  account: Joi.string().required(),
  isSalaryClient: isSalaryClientSchema,
  isInsuranceEnabled: isInsuranceEnabledSchema,
});

export const validateScoringData = (req: Request, res: Response, next: NextFunction) => {
  const { error }: ValidationResult<LoanApplicationRequestDTO> = scoringDataDTOSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.log(error.details);
    throw new BadRequestError(error.details[0].message);
  }

  next();
};
