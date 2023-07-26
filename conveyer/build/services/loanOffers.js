"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prescoring = exports.calculateLoanOffers = void 0;
const calculateCredit_js_1 = require("./calculateCredit.js");
const joi_1 = __importDefault(require("joi"));
const date_fns_1 = require("date-fns");
function calculateLoanOffers(request) {
    if (!prescoring(request)) {
        throw new Error("Invalid request data.");
    }
    const combinations = [
        { isInsuranceEnabled: false, isSalaryClient: false },
        { isInsuranceEnabled: false, isSalaryClient: true },
        { isInsuranceEnabled: true, isSalaryClient: false },
        { isInsuranceEnabled: true, isSalaryClient: true },
    ];
    const offers = [];
    for (const combination of combinations) {
        const offer = (0, calculateCredit_js_1.calculateCredit)(request, combination.isInsuranceEnabled, combination.isSalaryClient);
        offers.push(offer);
    }
    offers.sort((a, b) => a.rate - b.rate);
    return offers;
}
exports.calculateLoanOffers = calculateLoanOffers;
function prescoring(request) {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().min(2).max(30).required(),
        lastName: joi_1.default.string().min(2).max(30).required(),
        middleName: joi_1.default.string().min(2).max(30).optional(),
        amount: joi_1.default.number().min(10000).required(),
        term: joi_1.default.number().integer().min(6).required(),
        birthdate: joi_1.default.date().custom((value, helpers) => {
            const today = new Date();
            const age = (0, date_fns_1.differenceInYears)(today, value);
            if (age < 18)
                return helpers.error('any.invalid');
            return value;
        }, 'Age validation').required(),
        email: joi_1.default.string().pattern(/[\w\.]{2,50}@[\w\.]{2,20}/).required(),
        passportSeries: joi_1.default.string().length(4).pattern(/[0-9]{4}/).required(),
        passportNumber: joi_1.default.string().length(6).pattern(/[0-9]{6}/).required()
    });
    const { error } = schema.validate(request);
    if (error) {
        console.log(error.details);
        throw new Error(error.details[0].message);
    }
    return true;
}
exports.prescoring = prescoring;
//# sourceMappingURL=loanOffers.js.map