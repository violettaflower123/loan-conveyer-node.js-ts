import { Kafka } from "kafkajs";
import { db } from "../db.js";
export const kafka = new Kafka({
    clientId: 'deal-service',
    brokers: ['kafka-broker-1:19092'],
});
export const producer = kafka.producer();
export const sendMessage = async (topic, message) => {
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
export async function getFromDb(table, id) {
    const query = `SELECT * FROM ${table} WHERE ${table}_id = $1`;
    const result = await db.one(query, [id]);
    return result;
}
//# sourceMappingURL=kafka.service.js.map