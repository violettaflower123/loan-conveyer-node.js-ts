import { db } from '../db.js';
import { BadRequestError } from '../errors/errorClasses.js';
import { Kafka } from 'kafkajs';
import { MessageThemes } from '../types/types.js';
const kafka = new Kafka({
    clientId: 'deal-service',
    brokers: ['kafka-broker-1:19092'],
});
const producer = kafka.producer();
const sendMessage = async (topic, message) => {
    try {
        await producer.send({
            topic: topic,
            messages: [
                {
                    value: JSON.stringify(message),
                },
            ],
        });
        console.log('Сообщение успешно отправлено в топик: ', topic);
        await producer.disconnect();
    }
    catch (error) {
        console.error('Ошибка при отправке сообщения: ', error);
    }
};
export async function updateOffer(loanOffer) {
    const application = await db.one('SELECT * FROM application WHERE application_id = $1', [loanOffer.applicationId]);
    if (!application) {
        throw new BadRequestError(`Application with id ${loanOffer.applicationId} not found.`);
    }
    const client = await db.one('SELECT * FROM client WHERE client_id = $1', application.client_id);
    console.log('client', client);
    console.log('application one more', application);
    const updatedStatusHistory = [...(application.status_history || []), {
            status: "APPROVED",
            time: new Date(),
            changeType: "MANUAL"
        }];
    const updatedApplication = await db.one('UPDATE application SET status = $1, status_history = $2, applied_offer = $3 WHERE application_id = $4 RETURNING *', ["APPROVED", JSON.stringify(updatedStatusHistory), JSON.stringify(loanOffer), loanOffer.applicationId]);
    console.log('application update', updatedApplication);
    const getData = await db.any('SELECT * FROM application WHERE application_id = $1', application.application_id);
    console.log('appl', getData);
    await producer.connect();
    const message = {
        address: client.email,
        theme: MessageThemes.FinishRegistration,
        applicationId: updatedApplication.application_id,
        name: client.first_name,
        lastName: client.last_name
    };
    sendMessage('finish-registration', message);
    // await producer.disconnect();
    return updatedApplication;
}
//# sourceMappingURL=offer.service.js.map