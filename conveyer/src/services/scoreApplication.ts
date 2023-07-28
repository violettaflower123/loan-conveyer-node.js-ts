import { PaymentScheduleElement, ScoringDataDTO, CreditDTO } from "../dtos.js";
import { differenceInYears } from "date-fns";
import { Gender, Position, EmploymentStatus, MaritalStatus } from "../types/types.js";

function performScoring(data: ScoringDataDTO): { passed: boolean, rate: number, message: string } {
    let interestRate = 0.1; // процентная ставка
    let message = "Scoring passed successfully";

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

function calculateCreditParameters(data: ScoringDataDTO, rate: number): CreditDTO | null {
    // рассчет по формуле  аннуитетного платежа P = (S * i * (1 + i)^n) / ((1 + i)^n - 1), где P - ежемесячный платеж, 
    // S - сумма кредита, i - ежемесячная процентная ставка (годовая ставка / 12), n - срок кредита в месяцах

    const monthlyRate = rate / 12; 
    const termMonths = data.term; 

    const monthlyPayment = (data.amount * monthlyRate * Math.pow((1 + monthlyRate), termMonths)) / (Math.pow((1 + monthlyRate), termMonths) - 1);

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

