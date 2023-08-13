import { Kafka } from "kafkajs";
import { db } from "../db.js";
import { logger } from "../helpers/logger.js";
import { ServerError } from "../errors/errorClasses.js";
export const kafka = new Kafka({
    clientId: 'deal-service',
    brokers: ['kafka-broker-1:19092'],
});
export const producer = kafka.producer();
export async function getFromDb(table, id) {
    const query = `SELECT * FROM ${table} WHERE ${table}_id = $1`;
    const result = await db.one(query, [id]);
    return result;
}
export const sendKafkaMessage = async (topic, message) => {
    try {
        await producer.connect();
        await producer.send({
            topic: topic,
            messages: [{
                    value: JSON.stringify(message),
                }],
        });
        logger.info('Сообщение успешно отправлено в топик: ' + topic);
        await producer.disconnect();
    }
    catch (error) {
        logger.error('Ошибка при отправке сообщения: ' + error);
        throw new ServerError('Kafka service unavailable.');
    }
};
//# sourceMappingURL=kafka.service.js.map