import { promises as fsPromises } from 'fs';
import path from 'path';
import fs from 'fs';
import { EmailMessage } from '../dto';
import { logger } from '../helpers/logger';
import { PaymentScheduleElement } from '../dto';
import { sendEmail } from './sendEmail.service';

const filesPath = path.resolve(__dirname, '../../files');

export async function writeCreditAgreement(emailMessage: EmailMessage) {
    if (!fs.existsSync(path.resolve(__dirname, './files'))){
      fs.mkdirSync(path.resolve(__dirname, './files'));
    }
    
    const creditAgreementPath = path.resolve(filesPath, 'credit-agreement.txt');

    let txtContent = 'CREDIT AGREEMENT\n';
    txtContent += `THIS AGREEMENT is made the 4th day of August, 2023, 
    by and between ${emailMessage.name} ${emailMessage.lastName} (hereinafter "Borrower") and TU BANK (hereinafter "Lender").\n`;
    txtContent += `1. PROMISE TO PAY:\n
    Borrower promises to pay to Lender the sum of ${emailMessage.amount}, with interest 
    payable on the unpaid principal at the rate of ${emailMessage.rate} per annum.\n`;
    if (emailMessage.paymentData !== undefined) {
        txtContent += `2. PAYMENT:\n
        Borrower will make monthly payments of ${emailMessage.paymentData[0].totalPayment}, beginning one month from the date 
        this agreement is signed, until the principal and interest have been paid in full.\n`;
    }
    txtContent += `3. LATE CHARGE:\n
    If a payment is 15 days late, Borrower agrees to pay a late fee of 2% of the payment.`;
    txtContent += `4. COLLATERAL:\n
    Borrower agrees to secure the loan with the property located at ___________________________.`;
    txtContent += `5. DEFAULT:\n
    If Borrower fails to make a payment within 45 days of its due date, 
    the entire loan shall be due immediately at the Lender's discretion.`;
    txtContent += `6. PREPAYMENT:\n
    Borrower may prepay all or any part of the principal without penalty.`;
    txtContent += `7. LOAN AGREEMENT:\n
    The rights and obligations of the parties under this Agreement are governed by the laws of the State of New York.`;
    txtContent += `BORROWER:\n
    [Sign here]____________\n
    ${emailMessage.name} ${emailMessage.lastName}`;
    txtContent += `LENDER:\n
    [Sign here]____________\n
    TU BANK`;
  
    try {
      await fsPromises.writeFile(creditAgreementPath, txtContent);
      logger.info('TXT file has been written.');
    } catch (err) {
      logger.error(err);
    }
}


export async function writePaymentSchedule(data: PaymentScheduleElement[], creditId: string) {
    if (!fs.existsSync(path.resolve(__dirname, './files'))){
      fs.mkdirSync(path.resolve(__dirname, './files'));
    }
  
    const paymentSchedulePath = path.resolve(filesPath, 'payment-schedule.txt');

    let content = `Payment schedule for Loan № ${creditId}:\n`;
  
    data.forEach((payment) => {
        content += `\nMonth number: ${payment.number}\nDate: ${payment.date}\nTotal payment: ${payment.totalPayment}\nRemaining debt: ${payment.remainingDebt}\n`;
    });
  
    try {
      await fsPromises.writeFile(paymentSchedulePath, content);
      logger.info('TXT file with payment schedule has been written.');
    } catch (err) {
      logger.error(err);
    }
}

export async function generateClientForm(clientData: string, creditId: string) {
  const client = JSON.parse(clientData);

  if (!fs.existsSync(path.resolve(__dirname, './files'))){
    fs.mkdirSync(path.resolve(__dirname, './files'));
  }

  const clientFormPath = path.resolve(filesPath, 'client-form.txt');

  let txtContent = 'Client information\n';
  txtContent += `Client ID: ${client.client_id}\n`;
  txtContent += `Name: ${client.first_name} ${client.last_name}\n`;
  txtContent += `Birth date: ${client.birth_date}\n`;
  txtContent += `Email: ${client.email}\n`;
  txtContent += `Credit ID: ${creditId}\n`;

  try {
    await fsPromises.writeFile(clientFormPath, txtContent);
    logger.info('TXT file has been written.');
  } catch (err) {
    logger.error(err);
  }
}

export async function createFiles(emailMessage: any) {
    if (!fs.existsSync(path.resolve(__dirname, './files'))){
      fs.mkdirSync(path.resolve(__dirname, './files'));
    }
  
    if (emailMessage.theme === 'send-documents') {
      await Promise.all([
        writeCreditAgreement(emailMessage),
        writePaymentSchedule(emailMessage.paymentData, emailMessage.creditId),
        generateClientForm(emailMessage.clientData, emailMessage.creditId),
      ]);
    }
    sendEmail(emailMessage);
}
