import { db } from '../db.js';
export async function updateOffer(loanOffer) {
    const application = await db.one('SELECT * FROM application WHERE application_id = $1', [loanOffer.applicationId]);
    if (!application) {
        throw new Error(`Application with id ${loanOffer.applicationId} not found.`);
    }
    const updatedStatusHistory = [...(application.status_history || []), {
            status: "APPROVED",
            time: new Date(),
            changeType: "MANUAL"
        }];
    const updatedApplication = await db.one('UPDATE application SET status = $1, status_history = $2, applied_offer = $3 WHERE application_id = $4 RETURNING *', ["APPROVED", JSON.stringify(updatedStatusHistory), JSON.stringify(loanOffer), loanOffer.applicationId]);
    return updatedApplication;
}
//# sourceMappingURL=offer.service.js.map