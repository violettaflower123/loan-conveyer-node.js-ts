// расчет по формуле аннуитентного платежа P = (S * i * (1 + i)^n) / ((1 + i)^n - 1)
// P - ежемесячный платеж, S - сумма кредита, i - ежемесячная процентная ставка (годовая ставка / 12), n - срок кредита в месяцах
const INSURANCE_COST = 100000; // стоимость страховки
const INTEREST_RATE = 0.1; // процентная ставка
function calculateCredit(request, isInsuranceEnabled, isSalaryClient) {
    const creditAmount = request.amount;
    const insuranceAmount = isInsuranceEnabled ? INSURANCE_COST : 0;
    const totalAmount = creditAmount + insuranceAmount;
    const monthlyInterestRate = INTEREST_RATE / 12;
    const termInMonths = request.term;
    const monthlyPayment = (totalAmount * monthlyInterestRate * Math.pow((1 + monthlyInterestRate), termInMonths)) / (Math.pow((1 + monthlyInterestRate), termInMonths) - 1);
    const offer = {
        applicationId: Math.floor(Math.random() * 1000000),
        requestedAmount: request.amount,
        totalAmount: totalAmount,
        term: request.term,
        monthlyPayment: monthlyPayment,
        rate: isInsuranceEnabled ? INTEREST_RATE - 0.03 : INTEREST_RATE,
        isInsuranceEnabled: isInsuranceEnabled,
        isSalaryClient: isSalaryClient
    };
    return offer;
}
export { calculateCredit };
//# sourceMappingURL=calculateCredit.js.map