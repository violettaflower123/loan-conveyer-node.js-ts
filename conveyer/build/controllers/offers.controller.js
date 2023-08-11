import { calculateLoanOffers } from "../services/loanOffers.js";
import { logger } from "../helpers/logger.js";
export const createOffers = async (req, res, next) => {
    try {
        logger.info('Creating loan offers');
        const loanOffers = calculateLoanOffers(req.body);
        logger.info('Calculated oan offers:', loanOffers);
        return res.json(loanOffers);
    }
    catch (err) {
        logger.error('Error calculating loan offer', err);
        return next(err);
    }
};
//# sourceMappingURL=offers.controller.js.map