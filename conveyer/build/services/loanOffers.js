import { calculateCredit } from "./calculateCredit.js";
import { logger } from "../helpers/logger.js";
function calculateLoanOffers(request) {
    logger.info('Calculating credit offer with request details:', request);
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
        logger.debug(`Offer calculated for combination: ${JSON.stringify(combination)}`);
    }
    offers.sort((a, b) => a.rate - b.rate);
    logger.info('Credit offers successfully calculated and sorted');
    return offers;
}
export { calculateLoanOffers };
//# sourceMappingURL=loanOffers.js.map