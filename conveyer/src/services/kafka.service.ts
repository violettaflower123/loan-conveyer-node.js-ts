import { Kafka } from "kafkajs";
import { EmailMessage } from "../dtos.js";
import { db } from "../db.js";
import { logger } from "../helpers/logger.js";

export const kafka = new Kafka({
        clientId: 'deal-service',
        brokers: ['kafka-broker-1:19092'],
      });

export const producer = kafka.producer();

export const sendMessage = async (topic: string, message: EmailMessage) => {
try {
    await producer.send({
    topic: topic,
    messages: [
        {
        value: JSON.stringify(message),
        },
    ],
    });
    logger.info('Сообщение успешно отправлено в топик: ', topic);
    await producer.disconnect();
} catch (error) {
    logger.error('Ошибка при отправке сообщения: ', error); 
}
};

export async function getFromDb(table: string, id: string){
    const query = `SELECT * FROM ${table} WHERE ${table}_id = $1`;
    const result = await db.one(query, [id]);
    return result;
}