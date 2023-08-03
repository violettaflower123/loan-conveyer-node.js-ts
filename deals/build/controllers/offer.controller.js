import * as offerService from '../service/offer.service.js';
export const handleOfferUpdate = async (req, res, next) => {
    try {
        const loanOffer = req.body;
        const updatedApplication = await offerService.updateOffer(loanOffer);
        res.status(200).json(updatedApplication);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};
//# sourceMappingURL=offer.controller.js.map