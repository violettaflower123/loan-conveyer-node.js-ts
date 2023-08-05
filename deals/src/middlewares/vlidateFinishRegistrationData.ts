import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/errorClasses.js";
import Joi, { CustomHelpers} from "joi";
import { Gender, MaritalStatus, EmploymentStatus, Position } from "../types/types.js";
import { isValid } from "date-fns";

const finishRegistrationRequestSchema = Joi.object({
    gender: Joi.string().valid(...Object.values(Gender)).required(),
    maritalStatus: Joi.string().valid(...Object.values(MaritalStatus)).required(),
    dependentNumber: Joi.number().integer().min(0).required(),
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
    employment: Joi.object({
      employmentStatus: Joi.string().valid(...Object.values(EmploymentStatus)).required(),
      employerINN: Joi.string().required(),
      salary: Joi.number().positive().required(),
      position: Joi.string().valid(...Object.values(Position)).required(),
      workExperienceTotal: Joi.number().integer().min(12).required(),
      workExperienceCurrent: Joi.number().integer().min(3).required(),
    }).required(),
    account: Joi.string().required(),
  });
  

export const validateRegistrationData = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = finishRegistrationRequestSchema.validate(req.body);

    if (error) {
        const errorMessage = error.details[0].message;
        const customError = new BadRequestError(errorMessage);
        return next(customError);
    }

    next();
};