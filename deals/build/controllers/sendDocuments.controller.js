import { ResourceNotFoundError, BadRequestError, ConflictError, ServerError, AuthorizationError, ValidationError } from "../errors/errorClasses.js";
import { MessageThemes } from "../types/types.js";
import { sendMessage, producer } from "../service/kafka.service.js";
import { getFromDb } from "../service/kafka.service.js";
// export async function getFromDb(table: string, id: string){
//     const query = `SELECT * FROM ${table} WHERE ${table}_id = $1`;
//     const result = await db.one(query, [id]);
//     return result;
// }
// const kafka = new Kafka({
//     clientId: 'deal-service',
//     brokers: ['kafka-broker-1:19092'],
//   });
// const producer = kafka.producer();
// const sendMessage = async (topic: string, message: EmailMessage) => {
//   try {
//     await producer.send({
//       topic: topic,
//       messages: [
//         {
//           value: JSON.stringify(message),
//         },
//       ],
//     });
//     console.log('Сообщение успешно отправлено в топик: ', topic);
//     await producer.disconnect();
//   } catch (error) {
//     console.error('Ошибка при отправке сообщения: ', error);
//   }
// };
export const sendDocuments = async (req, res) => {
    try {
        const applicationId = req.params.applicationId;
        const application = await getFromDb('application', applicationId);
        const creditId = application.credit_id;
        const clientId = JSON.parse(application.client_id);
        const client = await getFromDb('client', clientId);
        const credit = await getFromDb('credit', creditId);
        const payJson = JSON.parse(credit.payment_schedule);
        const clientJson = JSON.stringify(client);
        if (!application) {
            throw new ResourceNotFoundError('Application not found.');
        }
        await producer.connect();
        const message = {
            address: client.email,
            theme: MessageThemes.SendDocuments,
            applicationId: applicationId,
            name: client.first_name,
            lastName: client.last_name,
            paymentData: payJson,
            clientData: clientJson,
            creditId: credit.credit_id,
            amount: credit.amount,
            rate: credit.rate,
        };
        sendMessage('send-documents', message);
        res.send('Hey');
    }
    catch (err) {
        const error = err;
        console.log(error);
        if (error instanceof BadRequestError ||
            error instanceof ConflictError ||
            error instanceof ResourceNotFoundError ||
            error instanceof AuthorizationError ||
            error instanceof ValidationError ||
            error instanceof ServerError) {
            res.status(error.statusCode).send({
                message: error.message
            });
        }
        else {
            // If the error is not of any expected type, return a general server error
            res.status(500).send({
                message: 'An unexpected error occurred.',
                error: error.message
            });
        }
    }
};
//# sourceMappingURL=sendDocuments.controller.js.map