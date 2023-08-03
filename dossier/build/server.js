"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const fs_1 = __importDefault(require("fs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const logoPath = path_1.default.join(__dirname, 'logo.png');
function generatePaymentSchedule(paymentData) {
    let txtContent = "Номер платежа | Дата | Общая сумма платежа | Проценты | Сумма погашения долга | Остаток долга\n";
    paymentData.forEach(payment => {
        txtContent += `${payment.number} | ${payment.date} | ${payment.totalPayment} | ${payment.interestPayment} | ${payment.debtPayment} | ${payment.remainingDebt}\n`;
    });
    fs_1.default.writeFile('./payment-schedule.txt', txtContent, function (err) {
        if (err)
            throw err;
        console.log("TXT file has been written.");
    });
}
// import PDFDocument from 'pdfkit';
// import fs from 'fs';
// import fastcsv from 'fast-csv';
// function generateCreditAgreement(agreementData) {
//   let doc = new PDFDocument;
//   doc.text(`Agreement ID: ${agreementData.id}`);
//   doc.text(`Client: ${agreementData.clientName}`);
//   doc.text(`Amount: ${agreementData.amount}`);
//   // добавьте все необходимые данные в PDF
//   doc.pipe(fs.createWriteStream('./credit-agreement.pdf'));
//   doc.end();
// }
// function generateClientForm(clientData) {
//   let doc = new PDFDocument;
//   doc.text(`Client ID: ${clientData.id}`);
//   doc.text(`Name: ${clientData.name}`);
//   doc.text(`Email: ${clientData.email}`);
//   // добавьте все необходимые данные в PDF
//   doc.pipe(fs.createWriteStream('./client-form.pdf'));
//   doc.end();
// }
async function sendEmail(emailMessage) {
    console.log('Sending email...');
    try {
        let transporter = nodemailer_1.default.createTransport({
            host: 'smtp.yandex.com',
            port: 465,
            secure: true,
            auth: {
                user: 'violetta.frontend@yandex.ru',
                pass: 'mzqzyddvqjhcxuma',
            },
        });
        console.log('Transporter created.');
        let emailText = '';
        switch (emailMessage.theme) {
            case 'finish-registration':
                emailText = `Hello ${emailMessage.name} ${emailMessage.lastName},<br><br>
                    Thank you for choosing our bank. To complete your application, please finish the registration process.
                    <br><br>
                    Best regards,<br><br>
                    Customer Service Team,<br><br>
                    TU Bank`;
                break;
            case 'create-documents':
                emailText = `Dear Mr./Ms. ${emailMessage.name} ${emailMessage.lastName},
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

                    Best regards,<br><br>
                    Customer Service Team,<br><br>
                    TU Bank`;
                break;
            // case 'send-documents':
            //   emailText = `Hello ${emailMessage.name} ${emailMessage.lastName},<br><br>
            //               We are sending you the documents attached to this email: the credit agreement, payment schedule and client information.
            //               Please sign the documents to proceed with your application.
            //               <br><br>
            //               Best regards,<br><br>
            //               Customer Service Team,<br><br>
            //               TU Bank`;
            //   break;
            case 'send-documents':
                emailText = `Hello ${emailMessage.name} ${emailMessage.lastName},<br><br>
                        We are sending you the documents attached to this email: the credit agreement, payment schedule, and client information.
                        Please sign the documents to proceed with your application.
                        <br><br>
                        Payment Schedule:
                        <table border="1">
                          <tr>
                            <th>Month number</th>
                            <th>Date</th>
                            <th>Total Payment</th>
                            <th>Interest Payment</th>
                            <th>Debt Payment</th>
                            <th>Remaining Debt</th>
                          </tr>
                          ${emailMessage.paymentData.map((data) => `
                          <tr>
                            <td>${data.number}</td>
                            <td>${data.date}</td>
                            <td>${data.totalPayment}</td>
                            <td>${data.interestPayment}</td>
                            <td>${data.debtPayment}</td>
                            <td>${data.remainingDebt}</td>
                          </tr>
                          `).join('')}
                        </table>
                        <br><br>
                        Best regards,<br><br>
                        Customer Service Team,<br><br>
                        TU Bank`;
                break;
            case 'send-ses':
                emailText = `Hello ${emailMessage.name} ${emailMessage.lastName},<br><br>
                    Please check your SES (Secure Email Service) for important updates on your application.
                    <br><br>
                    Best regards,<br><br>
                    Customer Service Team,<br><br>
                    TU Bank`;
                break;
            case 'credit-issued':
                emailText = `Hello ${emailMessage.name} ${emailMessage.lastName},<br><br>
                    We are pleased to inform you that your credit has been issued.
                    <br><br>
                    Best regards,<br><br>
                    Customer Service Team,<br><br>
                    TU Bank`;
                break;
            case 'application-denied':
                emailText = `Hello ${emailMessage.name} ${emailMessage.lastName},<br><br>
                    We regret to inform you that your application has been denied. 
                    Please contact our customer service for further information.
                    <br><br>
                    Best regards,<br><br>
                    Customer Service Team,<br><br>
                    TU Bank`;
                break;
        }
        if (!fs_1.default.existsSync('./files')) {
            fs_1.default.mkdirSync('./files');
        }
        fs_1.default.writeFileSync('./files/email.html', `<p">${emailText}</p>
    <img src="cid:logo" alt="Bank Logo" style="display: block; margin: 0 auto; width: 100px; height: auto;" />`);
        let mailOptions = {
            from: 'TU Bank "violetta.frontend@yandex.ru"',
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
    }
    catch (err) {
        console.log('Error in sendEmail: ', err);
    }
}
console.log('123 here kafka');
const kafka = new kafkajs_1.Kafka({
    clientId: 'dossier-service',
    brokers: ['kafka-broker-1:19092'],
});
const consumer = kafka.consumer({ groupId: 'dossier-group' });
consumer.on('consumer.crash', (error) => {
    console.error('Consumer crashed:', error);
});
const runConsumer = async () => {
    console.log('Connecting to Kafka...');
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
    console.log('Connected to Kafka.');
    console.log('Subscribing to topic...');
    await consumer.subscribe({ topic: 'finish-registration' });
    console.log('Subscribed to topic.');
    console.log('Starting message processing...');
    await consumer.run({
        eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
            console.log(topic);
            if (message.value) {
                console.log('Received a message:', {
                    key: message.key ? message.key.toString() : null,
                    value: message.value ? message.value.toString() : null,
                    headers: message.headers,
                });
                const emailMessage = JSON.parse(message.value.toString());
                if (topic === 'send-documents') {
                    // generateCreditAgreement(emailMessage.agreementData);
                    generatePaymentSchedule(emailMessage.paymentData);
                    // generateClientForm(emailMessage.clientData);
                }
                await sendEmail(emailMessage);
            }
        },
    });
    console.log('Started message processing.');
};
runConsumer().catch(console.error);
//   await consumer.subscribe({ topic: 'finish-registration' });
//   await consumer.subscribe({ topic: 'create-documents' });
//   await consumer.subscribe({ topic: 'send-documents' });
//   await consumer.subscribe({ topic: 'send-ses' });
//   await consumer.subscribe({ topic: 'credit-issued' });
//   await consumer.subscribe({ topic: 'application-denied' });
//# sourceMappingURL=server.js.map