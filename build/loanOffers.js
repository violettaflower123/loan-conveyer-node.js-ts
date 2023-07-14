import { calculateCredit } from "./calculateCredit.js";
import Joi from "joi";
import { differenceInYears } from "date-fns";
function calculateLoanOffers(request) {
    if (!prescoring(request)) {
        return [];
    }
    const combinations = [
        { isInsuranceEnabled: false, isSalaryClient: false },
        { isInsuranceEnabled: false, isSalaryClient: true },
        { isInsuranceEnabled: true, isSalaryClient: false },
        { isInsuranceEnabled: true, isSalaryClient: true },
    ];
    const offers = [];
    for (const combination of combinations) {
        const offer = calculateCredit(request, combination.isInsuranceEnabled, combination.isSalaryClient);
        offers.push(offer);
    }
    offers.sort((a, b) => a.rate - b.rate);
    return offers;
}
function prescoring(request) {
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
            return value;
        }, 'Age validation').required(),
        email: Joi.string().pattern(/[\w\.]{2,50}@[\w\.]{2,20}/).required(),
        passportSeries: Joi.string().length(4).pattern(/[0-9]{4}/).required(),
        passportNumber: Joi.string().length(6).pattern(/[0-9]{6}/).required()
    });
    const { error } = schema.validate(request);
    if (error) {
        console.log(error.details);
        return false;
    }
    return !error;
}
export { calculateLoanOffers, prescoring };
//# sourceMappingURL=loanOffers.js.map