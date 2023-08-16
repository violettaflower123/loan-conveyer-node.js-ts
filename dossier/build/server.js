"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const logger_1 = require("./helpers/logger");
const sendEmail_service_1 = require("./services/sendEmail.service");
const writingDocuments_service_1 = require("./services/writingDocuments.service");
const kafka = new kafkajs_1.Kafka({
    clientId: 'dossier-service',
    brokers: ['kafka-broker-1:19092'],
});
const consumer = kafka.consumer({ groupId: 'dossier-group' });
consumer.on('consumer.crash', (error) => {
    logger_1.logger.error('Consumer crashed:', error);
});
const runConsumer = async () => {
    await consumer.connect();
    const topics = [
        'finish-registration',
        'create-documents',
        'send-documents',
        'send-ses',
        'credit-issued',
        'application-denied'
    ];
    for (const topic of topics) {
        await consumer.subscribe({ topic: topic });
        logger_1.logger.info(`Subscribed to ${topic}.`);
    }
    await consumer.run({
        eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
            console.log(topic);
            if (message.value) {
                const emailMessage = JSON.parse(message.value.toString());
                if (topic === 'send-documents') {
                    await (0, writingDocuments_service_1.createFiles)(emailMessage);
                }
                else {
                    await (0, sendEmail_service_1.sendEmail)(emailMessage);
                }
            }
        },
    });
    logger_1.logger.info('Started message processing.');
};
runConsumer().catch(console.error);
//# sourceMappingURL=server.js.map