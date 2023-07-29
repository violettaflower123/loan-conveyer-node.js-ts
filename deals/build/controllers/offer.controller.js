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
    // catch (err) {
    //     next(err);
    //     console.log('Error!!');
    //     const error = err as Error;
    //     return res.status(400).json({ error: error.message });
    // }
};
//# sourceMappingURL=offer.controller.js.map