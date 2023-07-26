import * as offerService from '../services/offer.service.js';
export const handleOfferUpdate = async (req, res, next) => {
    try {
        const loanOffer = req.body;
        const updatedApplication = await offerService.updateOffer(loanOffer);
        res.status(200).json(updatedApplication);
    }
    catch (err) {
        next(err);
        console.log('Error!!');
        const error = err;
        return res.status(400).json({ error: error.message });
    }
};
//# sourceMappingURL=offer.controller.js.map