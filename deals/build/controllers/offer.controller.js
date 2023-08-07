import * as offerService from '../service/offer.service.js';
import { logger } from '../helpers/logger.js';
export const handleOfferUpdate = async (req, res, next) => {
    try {
        const loanOffer = req.body;
        logger.info(`Received LoanOffer: ${loanOffer}`);
        const updatedApplication = await offerService.updateOffer(loanOffer);
        res.status(200).json(updatedApplication);
    }
    catch (err) {
        logger.error(`Error updating offer: ${err}`);
        next(err);
    }
};
//# sourceMappingURL=offer.controller.js.map