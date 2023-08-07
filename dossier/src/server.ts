import { Kafka } from 'kafkajs';
import { logger } from './helpers/logger';
import { sendEmail } from './services/sendEmail.service';
import { createFiles } from './services/writingDocuments.service';

// async function writeCreditAgreement(emailMessage: EmailMessage) {
//   if (!fs.existsSync(path.resolve(__dirname, './files'))){
//     fs.mkdirSync(path.resolve(__dirname, './files'));
//   }

//   const filePath = path.resolve(__dirname, './files/credit-agreement.txt');
//   let txtContent = 'CREDIT AGREEMENT\n';
//   txtContent += `THIS AGREEMENT is made the 4th day of August, 2023, 
//   by and between ${emailMessage.name} ${emailMessage.lastName} (hereinafter "Borrower") and TU BANK (hereinafter "Lender").\n`;
//   txtContent += `1. PROMISE TO PAY:\n
//   Borrower promises to pay to Lender the sum of ${emailMessage.amount}, with interest 
//   payable on the unpaid principal at the rate of ${emailMessage.rate} per annum.\n`;
//   if (emailMessage.paymentData !== undefined) {
//       txtContent += `2. PAYMENT:\n
//       Borrower will make monthly payments of ${emailMessage.paymentData[0].totalPayment}, beginning one month from the date 
//       this agreement is signed, until the principal and interest have been paid in full.\n`;
//   }
//   txtContent += `3. LATE CHARGE:\n
//   If a payment is 15 days late, Borrower agrees to pay a late fee of 2% of the payment.`;
//   txtContent += `4. COLLATERAL:\n
//   Borrower agrees to secure the loan with the property located at ___________________________.`;
//   txtContent += `5. DEFAULT:\n
//   If Borrower fails to make a payment within 45 days of its due date, 
//   the entire loan shall be due immediately at the Lender's discretion.`;
//   txtContent += `6. PREPAYMENT:\n
//   Borrower may prepay all or any part of the principal without penalty.`;
//   txtContent += `7. LOAN AGREEMENT:\n
//   The rights and obligations of the parties under this Agreement are governed by the laws of the State of New York.`;
//   txtContent += `BORROWER:\n
//   [Sign here]____________\n
//   ${emailMessage.name} ${emailMessage.lastName}`;
//   txtContent += `LENDER:\n
//   [Sign here]____________\n
//   TU BANK`;

//   try {
//     await fsPromises.writeFile(filePath, txtContent);
//     logger.info('TXT file has been written.');
//   } catch (err) {
//     logger.error(err);
//   }
// }
// async function writePaymentSchedule(data: PaymentScheduleElement[], creditId: string) {
//   if (!fs.existsSync(path.resolve(__dirname, './files'))){
//     fs.mkdirSync(path.resolve(__dirname, './files'));
//   }

//   const filePath = path.resolve(__dirname, './files/payment-schedule.txt');
//   let content = `Payment schedule for Loan № ${creditId}:\n`;

//   data.forEach((payment) => {
//       content += `\nMonth number: ${payment.number}\nDate: ${payment.date}\nTotal payment: ${payment.totalPayment}\nRemaining debt: ${payment.remainingDebt}\n`;
//   });

//   try {
//     await fsPromises.writeFile(filePath, content);
//     logger.info('TXT file with payment schedule has been written.');
//   } catch (err) {
//     logger.error(err);
//   }
// }

// async function generateClientForm(clientData: string, creditId: string) {
//   const client = JSON.parse(clientData);

//   if (!fs.existsSync(path.resolve(__dirname, './files'))){
//     fs.mkdirSync(path.resolve(__dirname, './files'));
//   }

//   const filePath = path.resolve(__dirname, './files/client-form.txt');
//   let txtContent = 'Client information\n';
//   txtContent += `Client ID: ${client.client_id}\n`;
//   txtContent += `Name: ${client.first_name} ${client.last_name}\n`;
//   txtContent += `Birth date: ${client.birth_date}\n`;
//   txtContent += `Email: ${client.email}\n`;
//   txtContent += `Credit ID: ${creditId}\n`;

//   try {
//     await fsPromises.writeFile(filePath, txtContent);
//     logger.info('TXT file has been written.');
//   } catch (err) {
//     logger.error(err);
//   }
// }

// async function createFiles(emailMessage: any) {
//   if (!fs.existsSync(path.resolve(__dirname, './files'))){
//     fs.mkdirSync(path.resolve(__dirname, './files'));
//   }

//   if (emailMessage.theme === 'send-documents') {
//     await Promise.all([
//       writeCreditAgreement(emailMessage),
//       writePaymentSchedule(emailMessage.paymentData, emailMessage.creditId),
//       generateClientForm(emailMessage.clientData, emailMessage.creditId),
//     ]);
//   }
// }

// async function sendEmail(emailMessage: any) {
//   try {
//     let transporter = nodemailer.createTransport({
//       host: 'smtp.yandex.com',
//       port: 465,
//       secure: true, 
//       auth: {
//         user: 'violetta.frontend@yandex.ru', 
//         pass: 'mzqzyddvqjhcxuma', 
//       },
//     });

//     let emailText = '';

//     switch (emailMessage.theme) {
//       case 'finish-registration':
//         const link = `/calculation/${emailMessage.applicationId}`;
//         emailText = `Dear Mr./Ms. ${emailMessage.name} ${emailMessage.lastName},<br><br>
//                   We hope this message finds you well.<br><br>
//                   Thank you for choosing our bank. To complete your application, 
//                   please follow the <a href="${link}">link</a> and finish the registration process.
//                   <br><br>
//                   Best regards,<br><br>
//                   Customer Service Team,<br><br>
//                   TU Bank<br>
//                   <img src="${logoPath} alt="logo" style="width: 100px; height: 100px; magrin: 10px auto">`;
//       break;
//       case 'create-documents':
//         emailText = `Dear Mr./Ms. ${emailMessage.name} ${emailMessage.lastName},
//                   <br><br>
//                   We hope this message finds you well.<br><br>

//                   We are glad to know that you are considering obtaining a credit facility 
//                   from our bank. In order to move forward, it's necessary that you request the creation of 
//                   the documents related to your application.<br><br>

//                   Please submit the request at your earliest convenience.<br><br>

//                   Once we receive your email we'll create your documents and 
//                   promptly continue with your application process.<br><br>

//                   If you have any questions or need further assistance, 
//                   please do not hesitate to contact us.<br><br>

//                   Thank you for choosing Your Wonderful Bank as your trusted financial partner.
//                   We look forward to serving you.<br><br>

//                   Best regards,<br><br>
//                   Customer Service Team,<br><br>
//                   TU Bank<br>
//                   <img src="${logoPath} alt="logo" style="width: 100px; height: 100px; magrin: 10px auto">`;
//       break;
//       case 'send-documents':
//         emailText = `Dear Mr./Ms. ${emailMessage.name} ${emailMessage.lastName},<br><br>
//                     We hope this message finds you well.<br><br>
//                     We are sending you the documents attached to this email: the credit agreement, payment schedule, and client information.
//                     Please sign the documents to proceed with your application.
//                     <br><br>
//                     Payment Schedule:
//                     <table border="1" style="width:90%; border-collapse: collapse; margin: 0 auto;">
//                       <tr>
//                         <th style="width:25%; padding:10px; border:1px solid black;">Month number</th>
//                         <th style="width:25%; padding:10px; border:1px solid black;">Date</th>
//                         <th style="width:25%; padding:10px; border:1px solid black;">Amount</th>
//                         <th style="width:25%; padding:10px; border:1px solid black;">Remaining Debt</th>
//                       </tr>
//                       ${emailMessage.paymentData.map((data: PaymentScheduleElement) => `
//                       <tr>
//                         <td>${data.number}</td>
//                         <td>${data.date}</td>
//                         <td>${data.totalPayment}</td>
//                         <td>${data.remainingDebt}</td>
//                       </tr>
//                       `).join('')}
//                     </table>
//                     <br><br>
//                     Best regards,<br><br>
//                     Customer Service Team,<br><br>
//                     TU Bank<br>
//                     <img src="${logoPath} alt="logo" style="width: 100px; height: 100px; magrin: 10px auto">`;
//       break;
//       case 'send-ses':
//         // const sesCode = generateRandomNumber();
//         emailText = `Dear Mr./Ms. ${emailMessage.name} ${emailMessage.lastName},<br><br>
//                       We hope this message finds you well.<br><br>
//                       We are sending you the security code to sign your loan agreement:<br>
//                       <div style="width: 70%; padding: 30px; font-size: 3rem; 
//                       font-weight: bold; background-color: #e5f6d6; margin: 30px auto; text-align: center;">${emailMessage.sesCode}</div>
//                       <br>
//                       Please visit the following <a href="#">link</a> to submit the code and your application ID.
//                       <br><br>
//                       Best regards,<br><br>
//                       Customer Service Team,<br><br>
//                       TU Bank<br><br>
//                       <img src="${logoPath} alt="logo" style="width: 100px; height: 100px; magrin: 10px auto">`;
//       break;
//       case 'credit-issued':
//         emailText = `Dear ${emailMessage.name} ${emailMessage.lastName},<br><br>
//                   We would like to inform you that your loan application has been processed successfully.
//                   <br><br>
//                   Best regards,<br><br>
//                   Customer Service Team,<br><br>
//                   TU Bank<br>
//                   <img src="${logoPath} alt="logo" style="width: 100px; height: 100px; magrin: 10px auto">`;
//       break;
//       case 'application-denied':
//         emailText = `Dear Mr./Ms. ${emailMessage.name} ${emailMessage.lastName},<br><br>
//                   We regret to inform you that your application has been denied. 
//                   Please contact our customer service for further information.
//                   <br><br>
//                   Best regards,<br><br>
//                   Customer Service Team,<br><br>
//                   TU Bank<br>
//                   <img src="${logoPath} alt="logo" style="width: 100px; height: 100px; magrin: 10px auto">`;
//       break;
//     }

//     if (!fs.existsSync('./files')){
//         fs.mkdirSync('./files');
//     }

//     fs.writeFileSync('./files/email.html', `<p">${emailText}</p>
//     <img src="cid:logo" alt="Bank Logo" style="display: block; margin: 0 auto; width: 100px; height: 100px;" />`);

//     let attachments = [
//       {
//         filename: 'logo.png',
//         path: logoPath,
//         cid: 'logo'
//       }
//     ];
    
//     if (emailMessage.theme === 'send-documents') {
//       attachments.push(
//         {
//           filename: 'payment-schedule.txt',
//           path: path.resolve(__dirname, './files/payment-schedule.txt'),
//           cid: 'payment-schedule@yourapp',
//         },
//         {
//           filename: 'credit-agreement.txt',
//           path: path.resolve(__dirname, './files/credit-agreement.txt'),
//           cid: 'credit-agreement@yourapp',
//         },
//         {
//           filename: 'client-form.txt',
//           path: path.resolve(__dirname, './files/client-form.txt'),
//           cid: 'client-form@yourapp',
//         }
//       );
//     }
    
//     let mailOptions = {
//       from: 'TU Bank "violetta.frontend@yandex.ru"', 
//       to: emailMessage.address,
//       subject: emailMessage.theme, 
//       attachments: attachments,
//       html: {
//         path: './files/email.html'
//       }
//     };    

//     console.log('Mail options created.');
//     let info = await transporter.sendMail(mailOptions); 

//     logger.info('Email sent: ' + info.response);
//   } catch (err) {
//     logger.error('Error in sendEmail: ', err);
//   }
// }


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
