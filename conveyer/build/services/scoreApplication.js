"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCreditParameters = exports.performScoring = void 0;
const date_fns_1 = require("date-fns");
const dtos_1 = require("../dtos");
const joi_1 = __importDefault(require("joi"));
const scoringDataDTOSchema = joi_1.default.object({
    amount: joi_1.default.number().min(10000).required(),
    term: joi_1.default.number().integer().min(6).required(),
    firstName: joi_1.default.string().min(2).max(30).required(),
    lastName: joi_1.default.string().min(2).max(30).required(),
    middleName: joi_1.default.string().min(2).max(30).optional(),
    email: joi_1.default.string().pattern(/[\w\.]{2,50}@[\w\.]{2,20}/).required(),
    birthdate: joi_1.default.date().custom((value, helpers) => {
        const today = new Date();
        const age = (0, date_fns_1.differenceInYears)(today, value);
        if (age < 18)
            return helpers.error('any.invalid');
        return value;
    }, 'Age validation').required(),
    passportSeries: joi_1.default.string().length(4).pattern(/[0-9]{4}/).required(),
    passportNumber: joi_1.default.string().length(6).pattern(/[0-9]{6}/).required(),
    gender: joi_1.default.string().valid(...Object.values(dtos_1.Gender)).required(),
    passportIssueDate: joi_1.default.string().isoDate().required(),
    passportIssueBranch: joi_1.default.string().required(),
    maritalStatus: joi_1.default.string().valid(...Object.values(dtos_1.MaritalStatus)).required(),
    dependentNumber: joi_1.default.number().required(),
    employment: joi_1.default.object({
        employmentStatus: joi_1.default.string().valid(...Object.values(dtos_1.EmploymentStatus)).required(),
        employerINN: joi_1.default.string().required(),
        salary: joi_1.default.number().required(),
        position: joi_1.default.string().valid(...Object.values(dtos_1.Position)).required(),
        workExperienceTotal: joi_1.default.number().required(),
        workExperienceCurrent: joi_1.default.number().required(),
    }).required(),
    account: joi_1.default.string().required(),
    isInsuranceEnabled: joi_1.default.boolean().required(),
    isSalaryClient: joi_1.default.boolean().required()
});
function performScoring(data) {
    let interestRate = 0.1; // процентная ставка
    let message = "Scoring passed successfully";
    const { error } = scoringDataDTOSchema.validate(data);
    if (error) {
        console.log(error.details);
        throw new Error(error.details[0].message);
    }
    const { employment, maritalStatus, dependentNumber, gender, birthdate, amount } = data;
    const age = (0, date_fns_1.differenceInYears)(new Date(), new Date(birthdate));
    const totalExperience = employment.workExperienceTotal;
    const currentExperience = employment.workExperienceCurrent;
    console.log('Calculated age:', age);
    if (age < 20 || age > 60) {
        message = "Rejected: The applicant's age is outside the acceptable range of 20 to 60 years.";
        return { passed: false, rate: 0, message }; // reject
        // return { passed: false, rate: 0, message }; // reject
    }
    if (totalExperience < 12 || currentExperience < 3) {
        message = "Rejected: Insufficient work experience.";
        return { passed: false, rate: 0, message };
    }
    if (amount > employment.salary * 20) {
        message = "Rejected: Loan amount exceeds the allowed limit based on salary.";
        return { passed: false, rate: 0, message };
    }
    if (employment.employmentStatus === dtos_1.EmploymentStatus.Unemployed) {
        message = "Rejected: Applicant is unemployed.";
        return { passed: false, rate: 0, message };
    }
    if (employment.employmentStatus === dtos_1.EmploymentStatus.SelfEmployed) {
        interestRate += 0.01;
    }
    if (employment.employmentStatus === dtos_1.EmploymentStatus.BusinessOwner) {
        interestRate += 0.03;
    }
    if (employment.position === dtos_1.Position.MiddleManager) {
        interestRate -= 0.02;
    }
    if (employment.position === dtos_1.Position.TopManager) {
        interestRate -= 0.04;
    }
    if (maritalStatus === dtos_1.MaritalStatus.Married) {
        interestRate -= 0.03;
    }
    if (maritalStatus === dtos_1.MaritalStatus.Divorced) {
        interestRate += 0.01;
    }
    if (dependentNumber > 1) {
        interestRate += 0.01;
    }
    if ((gender === dtos_1.Gender.Female && age >= 35 && age <= 60) ||
        (gender === dtos_1.Gender.Male && age >= 30 && age <= 55)) {
        interestRate -= 0.03;
    }
    return { passed: true, rate: interestRate, message };
}
exports.performScoring = performScoring;
function calculateCreditParameters(data, rate) {
    const monthlyRate = rate / 12;
    const termMonths = data.term;
    const monthlyPayment = data.amount * (monthlyRate + monthlyRate / (Math.pow(1 + monthlyRate, termMonths) - 1));
    const totalAmount = monthlyPayment * termMonths;
    // ПСК (полная стоимость кредита) - это отношение полной суммы кредита к сумме, которую берем в кредит
    const psk = totalAmount / data.amount;
    const paymentSchedule = calculatePaymentSchedule(data.amount, monthlyRate, termMonths, monthlyPayment);
    const credit = {
        amount: data.amount,
        term: data.term,
        monthlyPayment: monthlyPayment,
        rate: rate,
        psk: psk,
        isInsuranceEnabled: data.isInsuranceEnabled,
        isSalaryClient: data.isSalaryClient,
        paymentSchedule: paymentSchedule
    };
    return credit;
}
exports.calculateCreditParameters = calculateCreditParameters;
function calculatePaymentSchedule(amount, monthlyRate, termMonths, monthlyPayment) {
    console.log('calculatePaymentSchedule', amount, monthlyRate, termMonths, monthlyPayment);
    const paymentSchedule = [];
    let remainingDebt = amount;
    for (let i = 0; i < termMonths; i++) {
        const interestPayment = remainingDebt * monthlyRate;
        const debtPayment = monthlyPayment - interestPayment;
        remainingDebt -= debtPayment;
        const nextPaymentDate = new Date();
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + i + 1);
        paymentSchedule.push({
            number: i + 1,
            date: nextPaymentDate.toISOString().split('T')[0],
            totalPayment: monthlyPayment,
            interestPayment: interestPayment,
            debtPayment: debtPayment,
            remainingDebt: remainingDebt
        });
    }
    return paymentSchedule;
}
//# sourceMappingURL=scoreApplication.js.map