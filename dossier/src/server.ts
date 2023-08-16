import { Kafka } from 'kafkajs';
import { logger } from './helpers/logger';
import { sendEmail } from './services/sendEmail.service';
import { createFiles } from './services/writingDocuments.service';

const kafka = new Kafka({
  clientId: 'dossier-service',
  brokers: ['kafka-broker-1:19092'], 
});

const consumer = kafka.consumer({ groupId: 'dossier-group' });

consumer.on('consumer.crash', (error) => {
  logger.error('Consumer crashed:', error);
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
    logger.info(`Subscribed to ${topic}.`);
  }

  await consumer.run({
    
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      console.log(topic);
      if (message.value) {
        const emailMessage = JSON.parse(message.value.toString());

        if (topic === 'send-documents') {
          await createFiles(emailMessage);
        } else {
          await sendEmail(emailMessage); 
        }

      }
    },    
  });
  logger.info('Started message processing.')
};


runConsumer().catch(console.error);
