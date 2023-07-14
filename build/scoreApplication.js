import { differenceInYears } from "date-fns";
function performScoring(data) {
    let interestRate = 0.1; // процентная ставка
    const { employment, maritalStatus, dependentNumber, gender, birthdate, amount } = data;
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
    if (employment.employmentStatus === "Unemployed") {
        return { passed: false, rate: 0 };
    }
    if (employment.employmentStatus === "SelfEmployed") {
        interestRate += 0.01;
    }
    if (employment.employmentStatus === "BusinessOwner") {
        interestRate += 0.03;
    }
    if (employment.position === "MiddleManager") {
        interestRate -= 0.02;
    }
    if (employment.position === "TopManager") {
        interestRate -= 0.04;
    }
    if (maritalStatus === "Married") {
        interestRate -= 0.03;
    }
    if (maritalStatus === "Divorced") {
        interestRate += 0.01;
    }
    if (dependentNumber > 1) {
        interestRate += 0.01;
    }
    if ((gender === "Female" && age >= 35 && age <= 60) ||
        (gender === "Male" && age >= 30 && age <= 55)) {
        interestRate -= 0.03;
    }
    return { passed: true, rate: interestRate };
}
function calculateCreditParameters(data, rate) {
    console.log('calculateCreditParams', data);
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