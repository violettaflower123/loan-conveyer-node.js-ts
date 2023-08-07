import axios from "axios";
import { logger } from "../helpers/logger.js";
export const updateOffer = async (req, res) => {
    try {
        const loanOffer = req.body;
        logger.info('Received a loan offer update request:', loanOffer);
        const response = await axios.put('http://api-deals:3002/deal/offer ', loanOffer);
        if (!response.data) {
            logger.warn('Something went wrong when reaching /deal/offer');
            throw new Error('Something went wrong when reaching /deal/offer');
        }
        logger.info('Successfully updated the loan offer.');
        return res.status(200).json({ message: 'Application is updated successfully' });
    }
    catch (err) {
        const error = err;
        logger.error('Error occurred while updating the loan offer:', error);
        if (error.response) {
            const responseData = error.response.data;
            return res.status(400).json({ error: responseData || error.message });
        }
        return res.status(400).json({ error: error.message });
    }
};
//# sourceMappingURL=offer.controller.js.map