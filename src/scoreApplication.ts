import { PaymentScheduleElement, ScoringDataDTO, CreditDTO } from "./dtos.js";
import { differenceInYears } from "date-fns";
import { Gender, Position, EmploymentStatus, MaritalStatus } from "./dtos.js";
import Joi from "joi";

const scoringDataDTOSchema = Joi.object({
    amount: Joi.number().required(),
    term: Joi.number().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    middleName: Joi.string().required(),
    email: Joi.string().email().required(),
    birthdate: Joi.string().isoDate().required(),
    passportSeries: Joi.string().required(),
    passportNumber: Joi.string().required(),
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



function performScoring(data: ScoringDataDTO): { passed: boolean, rate: number } {
    let interestRate = 0.1; // процентная ставка

    const validation = scoringDataDTOSchema.validate(data);

    if (validation.error) {
        throw new Error(validation.error.details[0].message);
    }

    const {
        employment,
        maritalStatus,
        dependentNumber,
        gender,
        birthdate,
        amount
    } = data;

    const age = differenceInYears(new Date(), new Date(birthdate));
    const totalExperience = employment.workExperienceTotal;
    const currentExperience = employment.workExperienceCurrent;

    if (age < 20 || age > 60) {
        return { passed: false, rate: 0 }; // reject
    }

    if (totalExperience < 12 || currentExperience < 3) {
        return { passed: false, rate: 0 }; 
    }

    if (amount > employment.salary * 20) {
        return { passed: false, rate: 0 }; 
    }

    if (employment.employmentStatus === EmploymentStatus.Unemployed) {
        return { passed: false, rate: 0 }; 
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
   
    return { passed: true, rate: interestRate };
}

function calculateCreditParameters(data: ScoringDataDTO, rate: number): CreditDTO | null {
    console.log('calculateCreditParams', data);
    const monthlyRate = rate / 12; 
    const termMonths = data.term; 

    const monthlyPayment = data.amount * (monthlyRate + monthlyRate / (Math.pow(1 + monthlyRate, termMonths) - 1));

    const totalAmount = monthlyPayment * termMonths;

    // ПСК (полная стоимость кредита) - это отношение полной суммы кредита к сумме, которую берем в кредит
    const psk = totalAmount / data.amount;

    const paymentSchedule = calculatePaymentSchedule(data.amount, monthlyRate, termMonths, monthlyPayment);

    const credit: CreditDTO = {
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

function calculatePaymentSchedule(amount: number, monthlyRate: number, termMonths: number, monthlyPayment: number): PaymentScheduleElement[] {
    console.log('calculatePaymentSchedule', amount, monthlyRate, termMonths, monthlyPayment);
    const paymentSchedule: PaymentScheduleElement[] = [];
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
