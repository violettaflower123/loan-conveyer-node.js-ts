import { LoanApplicationRequestDTO, LoanOfferDTO } from "../dtos.js";
import { v4 as uuidv4 } from 'uuid';
import { logger } from "../helpers/logger.js";

// расчет по формуле аннуитентного платежа P = (S * i * (1 + i)^n) / ((1 + i)^n - 1)
// P - ежемесячный платеж, S - сумма кредита, i - ежемесячная процентная ставка (годовая ставка / 12), n - срок кредита в месяцах

const INSURANCE_COST = 100000; // стоимость страховки
const INTEREST_RATE = 0.1; // процентная ставка

function calculateCredit(request: LoanApplicationRequestDTO, isInsuranceEnabled: boolean, isSalaryClient: boolean): LoanOfferDTO{
    logger.info('Calculating credit offer with request details:', request);

    const creditAmount = request.amount;
    const insuranceAmount = isInsuranceEnabled ? INSURANCE_COST : 0;
    const totalAmount = creditAmount + insuranceAmount; 

    const monthlyInterestRate = INTEREST_RATE / 12 / 100;

    const termInMonths = request.term; 

    const monthlyPayment = (totalAmount * monthlyInterestRate * Math.pow((1 + monthlyInterestRate), termInMonths)) / (Math.pow((1 + monthlyInterestRate), termInMonths) - 1);

    const offer: LoanOfferDTO = {
        applicationId: uuidv4(),
        requestedAmount: request.amount,
        totalAmount: totalAmount,
        term: request.term,
        monthlyPayment: Math.ceil(monthlyPayment), 
        rate: isInsuranceEnabled ? INTEREST_RATE - 0.03 : INTEREST_RATE,
        isInsuranceEnabled: isInsuranceEnabled,
        isSalaryClient: isSalaryClient
    };
    logger.info('Calculated offer:', offer);

    return offer;
}

export { calculateCredit };
