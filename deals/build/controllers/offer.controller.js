import * as offerService from '../service/offer.service.js';
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
    // try {
    //     const loanOffer: LoanOfferDTO = req.body;
    //     console.log('offer', loanOffer)
    //     const application = await db.one('SELECT * FROM application WHERE application_id = $1', [loanOffer.applicationId]);
    //     console.log('application', application);
    //     if (!application) {
    //         throw new Error(`Application with id ${loanOffer.applicationId} not found.`);
    //     }
    //     const updatedStatusHistory = [...(application.status_history || []), {
    //         status: "APPROVED",
    //         time: new Date(),
    //         changeType: "MANUAL"
    //     }];        
    //     const updateApplication = await db.one('UPDATE application SET status = $1, status_history = $2, applied_offer = $3 WHERE application_id = $4 RETURNING *',
    //         ["APPROVED", JSON.stringify(updatedStatusHistory), JSON.stringify(loanOffer), loanOffer.applicationId]);
    //     console.log('update', updateApplication);
    //     res.status(200).json(updateApplication);
    // } catch (err) {
    //     next(err);
    //     console.log('Error!!');
    //     const error = err as Error;
    //     return res.status(400).json({ error: error.message });
    // }
};
//# sourceMappingURL=offer.controller.js.map