import Joi from "joi";
import { differenceInYears, isValid } from "date-fns";
const schema = Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    middleName: Joi.string().min(2).max(30).optional(),
    amount: Joi.number().min(10000).required(),
    term: Joi.number().integer().min(6).required(),
    birthdate: Joi.date().custom((value, helpers) => {
        const today = new Date();
        const age = differenceInYears(today, value);
        if (age < 18)
            return helpers.error('any.invalid');
        if (!isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }, 'Age validation').required(),
    email: Joi.string().email().pattern(/.+@.+\..+/).required(),
    passportSeries: Joi.string().length(4).pattern(/[0-9]{4}/).required(),
    passportNumber: Joi.string().length(6).pattern(/[0-9]{6}/).required()
});
export const validateLoanApplicationBody = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        console.log(error.details);
        res.status(400).json({
            error: error.details[0].message
        });
        return;
    }
    next();
};
//# sourceMappingURL=validateLoanApplicationBody.js.map