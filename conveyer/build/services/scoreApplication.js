import { differenceInYears } from "date-fns";
import { Gender, Position, EmploymentStatus, MaritalStatus } from "../dtos.js";
import Joi from "joi";
const scoringDataDTOSchema = Joi.object({
    amount: Joi.number().min(10000).required(),
    term: Joi.number().integer().min(6).required(),
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    middleName: Joi.string().min(2).max(30).optional(),
    email: Joi.string().pattern(/[\w\.]{2,50}@[\w\.]{2,20}/).required(),
    birthdate: Joi.date().custom((value, helpers) => {
        const today = new Date();
        const age = differenceInYears(today, value);
        if (age < 18)
            return helpers.error('any.invalid');
        return value;
    }, 'Age validation').required(),
    passportSeries: Joi.string().length(4).pattern(/[0-9]{4}/).required(),
    passportNumber: Joi.string().length(6).pattern(/[0-9]{6}/).required(),
    gender: Joi.string().valid(...Object.values(Gender)).required(),
    passportIssueDate: Joi.string().isoDate().required(),
    passportIssueBranch: Joi.string().required(),
    maritalStatus: Joi.string().valid(...Object.values(MaritalStatus)).required(),
    dependentNumber: Joi.number().required(),
    employment: Joi.object({
        employmentStatus: Joi.string().valid(...Object.values(EmploymentStatus)).required(),
        employerINN: Joi.string().required(),
        salary: Joi.number().required(),
        position: Joi.string().valid(...Object.values(Position)).required(),
        workExperienceTotal: Joi.number().required(),
        workExperienceCurrent: Joi.number().required(),
    }).required(),
    account: Joi.string().required(),
    isInsuranceEnabled: Joi.boolean().required(),
    isSalaryClient: Joi.boolean().required()
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
    const age = differenceInYears(new Date(), new Date(birthdate));
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
    if (employment.employmentStatus === EmploymentStatus.Unemployed) {
        message = "Rejected: Applicant is unemployed.";
        return { passed: false, rate: 0, message };
    }
    if (employment.employmentStatus === EmploymentStatus.SelfEmployed) {
        interestRate += 0.01;
    }
    if (employment.employmentStatus === EmploymentStatus.BusinessOwner) {
        interestRate += 0.03;
    }
    if (employment.position === Position.MiddleManager) {
        interestRate -= 0.02;
    }
    if (employment.position === Position.TopManager) {
        interestRate -= 0.04;
    }
    if (maritalStatus === MaritalStatus.Married) {
        interestRate -= 0.03;
    }
    if (maritalStatus === MaritalStatus.Divorced) {
        interestRate += 0.01;
    }
    if (dependentNumber > 1) {
        interestRate += 0.01;
    }
    if ((gender === Gender.Female && age >= 35 && age <= 60) ||
        (gender === Gender.Male && age >= 30 && age <= 55)) {
        interestRate -= 0.03;
    }
    return { passed: true, rate: interestRate, message };
}
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
export { performScoring, calculateCreditParameters };
//# sourceMappingURL=scoreApplication.js.map