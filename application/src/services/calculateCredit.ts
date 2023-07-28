import { LoanApplicationRequestDTO, LoanOfferDTO } from "../dtos.js";
import { v4 as uuidv4 } from 'uuid';


const INSURANCE_COST = 100000; // стоимость страховки
const INTEREST_RATE = 0.1; // процентная ставка

function calculateCredit(request: LoanApplicationRequestDTO, isInsuranceEnabled: boolean, isSalaryClient: boolean): LoanOfferDTO{
    const creditAmount = request.amount;
    const insuranceAmount = isInsuranceEnabled ? INSURANCE_COST : 0;
    const interestAmount = creditAmount * INTEREST_RATE;
    // СК + % + СВК = ПСК
    const totalAmount = creditAmount + insuranceAmount + interestAmount;

    const offer: LoanOfferDTO = {
        applicationId: uuidv4(),
        requestedAmount: request.amount,
        totalAmount: totalAmount,
        term: request.term,
        monthlyPayment: totalAmount / request.term,
        rate: isInsuranceEnabled ? INTEREST_RATE - 0.03 : INTEREST_RATE,
        isInsuranceEnabled: isInsuranceEnabled,
        isSalaryClient: isSalaryClient
    };

    return offer;
}

export { calculateCredit };