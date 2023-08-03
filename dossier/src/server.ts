import { Kafka, KafkaMessage } from 'kafkajs';
import fs from 'fs';
import nodemailer from 'nodemailer';

import path from 'path';
const logoPath = path.join(__dirname, 'logo.png');

async function sendEmail(emailMessage: any) {
  console.log('Sending email...'); 
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.yandex.com',
      port: 465,
      secure: true, 
      auth: {
        user: 'violetta.frontend@yandex.ru', 
        pass: 'mzqzyddvqjhcxuma', 
      },
    });

    console.log('Transporter created.'); 

    // let emailText = `
    //   Hello ${emailMessage.name} ${emailMessage.lastName},
    //   Thank you for choosing our bank. To complete your application, please finish the registration process.
    //   Best regards,
    //   Your Bank Name
    // `;
    let emailText = '';

    switch (emailMessage.theme) {
      case 'finish-registration':
        emailText = `Hello ${emailMessage.name} ${emailMessage.lastName},<br><br>
                    Thank you for choosing our bank. To complete your application, please finish the registration process.
                    <br><br>
                    Best regards,
                    Your wonderful bank`;
        break;
      case 'create-documents':
        emailText = `Dear ${emailMessage.name} ${emailMessage.lastName},
                    <br><br>
                    We hope this message finds you well.<br><br>

                    We are glad to know that you are considering obtaining a credit facility 
                    from our bank. In order to move forward, it's necessary that you request the creation of 
                    the documents related to your application.<br><br>

                    Please submit the request at your earliest convenience.<br><br>

                    Once we receive your email we'll create your documents and 
                    promptly continue with your application process.<br><br>

                    If you have any questions or need further assistance, 
                    please do not hesitate to contact us.<br><br>

                    Thank you for choosing Your Wonderful Bank as your trusted financial partner.
                    We look forward to serving you.<br><br>

                    Best regards,
                    Your Wonderful Bank`;
        break;
      case 'send-documents':
        emailText = `Hello ${emailMessage.name} ${emailMessage.lastName},<br><br>
                    Please send us the required documents to proceed with your application.
                    <br><br>
                    Best regards,
                    Your wonderful bank`;
        break;
      case 'send-ses':
        emailText = `Hello ${emailMessage.name} ${emailMessage.lastName},<br><br>
                    Please check your SES (Secure Email Service) for important updates on your application.
                    <br><br>
                    Best regards,
                    Your wonderful bank`;
        break;
      case 'credit-issued':
        emailText = `Hello ${emailMessage.name} ${emailMessage.lastName},<br><br>
                    We are pleased to inform you that your credit has been issued.
                    <br><br>
                    Best regards,
                    Your wonderful bank`;
        break;
      case 'application-denied':
        emailText = `Hello ${emailMessage.name} ${emailMessage.lastName},<br><br>
                    We regret to inform you that your application has been denied. 
                    Please contact our customer service for further information.
                    <br><br>
                    Best regards,
                    Your wonderful bank`;
        break;
    }

    if (!fs.existsSync('./files')){
        fs.mkdirSync('./files');
    }

    fs.writeFileSync('./files/email.html', `<p">${emailText}</p>
    <img src="cid:logo" alt="Bank Logo" style="display: block; margin: 0 auto; width: 100px; height: auto;" />`);


    let mailOptions = {
      from: 'Your wonderful bank "violetta.frontend@yandex.ru"', 
      to: emailMessage.address,
      subject: emailMessage.theme, 
      attachments: [
      {
        filename: 'logo.png',
        path: logoPath,
        cid: 'logo'
      }
    ],
      html: {
        path: './files/email.html'
      }
    };

    console.log('Mail options created.');
    let info = await transporter.sendMail(mailOptions); 

    console.log('Email sent: ' + info.response); 
  } catch (err) {
    console.log('Error in sendEmail: ', err); 
  }
}

console.log('123 here kafka');

const kafka = new Kafka({
  clientId: 'dossier-service',
  brokers: ['kafka-broker-1:19092'], 
});

const consumer = kafka.consumer({ groupId: 'dossier-group' });

consumer.on('consumer.crash', (error) => {
  console.error('Consumer crashed:', error);
});


const runConsumer = async () => {
  console.log('Connecting to Kafka...')
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
    console.log(`Subscribed to ${topic}.`);
  }

  console.log('Connected to Kafka.')
  
  console.log('Subscribing to topic...')
  await consumer.subscribe({ topic: 'finish-registration' });
  console.log('Subscribed to topic.')

  console.log('Starting message processing...')

  await consumer.run({
    
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      if (message.value) {
        console.log('Received a message:', {
            key: message.key ? message.key.toString() : null,
            value: message.value ? message.value.toString() : null,
            headers: message.headers,
        });
        const emailMessage = JSON.parse(message.value.toString());
        await sendEmail(emailMessage); 
      }
    },    
  });
  console.log('Started message processing.')
};


runConsumer().catch(console.error);


//   await consumer.subscribe({ topic: 'finish-registration' });
//   await consumer.subscribe({ topic: 'create-documents' });
//   await consumer.subscribe({ topic: 'send-documents' });
//   await consumer.subscribe({ topic: 'send-ses' });
//   await consumer.subscribe({ topic: 'credit-issued' });
//   await consumer.subscribe({ topic: 'application-denied' });