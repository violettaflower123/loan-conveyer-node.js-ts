"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFiles = exports.generateClientForm = exports.writePaymentSchedule = exports.writeCreditAgreement = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const fs_2 = __importDefault(require("fs"));
const logger_1 = require("../helpers/logger");
const sendEmail_service_1 = require("./sendEmail.service");
const filesPath = path_1.default.resolve(__dirname, '../../files');
async function writeCreditAgreement(emailMessage) {
    if (!fs_2.default.existsSync(path_1.default.resolve(__dirname, './files'))) {
        fs_2.default.mkdirSync(path_1.default.resolve(__dirname, './files'));
    }
    const creditAgreementPath = path_1.default.resolve(filesPath, 'credit-agreement.txt');
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
        await fs_1.promises.writeFile(creditAgreementPath, txtContent);
        logger_1.logger.info('TXT file has been written.');
    }
    catch (err) {
        logger_1.logger.error(err);
    }
}
exports.writeCreditAgreement = writeCreditAgreement;
async function writePaymentSchedule(data, creditId) {
    if (!fs_2.default.existsSync(path_1.default.resolve(__dirname, './files'))) {
        fs_2.default.mkdirSync(path_1.default.resolve(__dirname, './files'));
    }
    const paymentSchedulePath = path_1.default.resolve(filesPath, 'payment-schedule.txt');
    let content = `Payment schedule for Loan № ${creditId}:\n`;
    data.forEach((payment) => {
        content += `\nMonth number: ${payment.number}\nDate: ${payment.date}\nTotal payment: ${payment.totalPayment}\nRemaining debt: ${payment.remainingDebt}\n`;
    });
    try {
        await fs_1.promises.writeFile(paymentSchedulePath, content);
        logger_1.logger.info('TXT file with payment schedule has been written.');
    }
    catch (err) {
        logger_1.logger.error(err);
    }
}
exports.writePaymentSchedule = writePaymentSchedule;
async function generateClientForm(clientData, creditId) {
    const client = JSON.parse(clientData);
    if (!fs_2.default.existsSync(path_1.default.resolve(__dirname, './files'))) {
        fs_2.default.mkdirSync(path_1.default.resolve(__dirname, './files'));
    }
    const clientFormPath = path_1.default.resolve(filesPath, 'client-form.txt');
    let txtContent = 'Client information\n';
    txtContent += `Client ID: ${client.client_id}\n`;
    txtContent += `Name: ${client.first_name} ${client.last_name}\n`;
    txtContent += `Birth date: ${client.birth_date}\n`;
    txtContent += `Email: ${client.email}\n`;
    txtContent += `Credit ID: ${creditId}\n`;
    try {
        await fs_1.promises.writeFile(clientFormPath, txtContent);
        logger_1.logger.info('TXT file has been written.');
    }
    catch (err) {
        logger_1.logger.error(err);
    }
}
exports.generateClientForm = generateClientForm;
async function createFiles(emailMessage) {
    if (!fs_2.default.existsSync(path_1.default.resolve(__dirname, './files'))) {
        fs_2.default.mkdirSync(path_1.default.resolve(__dirname, './files'));
    }
    if (emailMessage.theme === 'send-documents') {
        await Promise.all([
            writeCreditAgreement(emailMessage),
            writePaymentSchedule(emailMessage.paymentData, emailMessage.creditId),
            generateClientForm(emailMessage.clientData, emailMessage.creditId),
        ]);
    }
    (0, sendEmail_service_1.sendEmail)(emailMessage);
}
exports.createFiles = createFiles;
//# sourceMappingURL=writingDocuments.service.js.map