import { db } from '../db.js';
import { BadRequestError } from '../errors/errorClasses.js';
import { sendKafkaMessage } from './kafka.service.js';
import { MessageThemes } from '../types/types.js';
export async function updateOffer(loanOffer) {
    const application = await db.one('SELECT * FROM application WHERE application_id = $1', [loanOffer.applicationId]);
    if (!application) {
        throw new BadRequestError(`Application with id ${loanOffer.applicationId} not found.`);
    }
    const client = await db.one('SELECT * FROM client WHERE client_id = $1', application.client_id);
    const updatedStatusHistory = [...(application.status_history || []), {
            status: "APPROVED",
            time: new Date(),
            changeType: "MANUAL"
        }];
    const updatedApplication = await db.one('UPDATE application SET status = $1, status_history = $2, applied_offer = $3 WHERE application_id = $4 RETURNING *', ["APPROVED", JSON.stringify(updatedStatusHistory), JSON.stringify(loanOffer), loanOffer.applicationId]);
    const getData = await db.any('SELECT * FROM application WHERE application_id = $1', application.application_id);
    const topic = 'finish-registration';
    const message = {
        address: client.email,
        theme: MessageThemes.FinishRegistration,
        applicationId: updatedApplication.application_id,
        name: client.first_name,
        lastName: client.last_name
    };
    try {
        await sendKafkaMessage(topic, message);
    }
    catch (error) {
        console.error('Failed to send message:', error.message);
    }
    return updatedApplication;
}
//# sourceMappingURL=offer.service.js.map