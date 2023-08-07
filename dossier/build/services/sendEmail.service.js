"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("../helpers/logger");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logoPath = path_1.default.join(__dirname, '..', 'logo.png');
async function sendEmail(emailMessage) {
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
        let emailText = '';
        switch (emailMessage.theme) {
            case 'finish-registration':
                const link = `/calculation/${emailMessage.applicationId}`;
                emailText = `Dear Mr./Ms. ${emailMessage.name} ${emailMessage.lastName},<br><br>
                    We hope this message finds you well.<br><br>
                    Thank you for choosing our bank. To complete your application, 
                    please follow the <a href="${link}">link</a> and finish the registration process.
                    <br><br>
                    Best regards,<br><br>
                    Customer Service Team,<br><br>
                    TU Bank<br>
                    <img src="${logoPath} alt="logo" style="width: 100px; height: 100px; magrin: 10px auto">`;
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
                    TU Bank<br>
                    <img src="${logoPath} alt="logo" style="width: 100px; height: 100px; magrin: 10px auto">`;
                break;
            case 'send-documents':
                emailText = `Dear Mr./Ms. ${emailMessage.name} ${emailMessage.lastName},<br><br>
                      We hope this message finds you well.<br><br>
                      We are sending you the documents attached to this email: the credit agreement, payment schedule, and client information.
                      Please sign the documents to proceed with your application.
                      <br><br>
                      Payment Schedule:
                      <table border="1" style="width:90%; border-collapse: collapse; margin: 0 auto;">
                        <tr>
                          <th style="width:25%; padding:10px; border:1px solid black;">Month number</th>
                          <th style="width:25%; padding:10px; border:1px solid black;">Date</th>
                          <th style="width:25%; padding:10px; border:1px solid black;">Amount</th>
                          <th style="width:25%; padding:10px; border:1px solid black;">Remaining Debt</th>
                        </tr>
                        ${emailMessage.paymentData.map((data) => `
                        <tr>
                          <td>${data.number}</td>
                          <td>${data.date}</td>
                          <td>${data.totalPayment}</td>
                          <td>${data.remainingDebt}</td>
                        </tr>
                        `).join('')}
                      </table>
                      <br><br>
                      Best regards,<br><br>
                      Customer Service Team,<br><br>
                      TU Bank<br>
                      <img src="${logoPath} alt="logo" style="width: 100px; height: 100px; magrin: 10px auto">`;
                break;
            case 'send-ses':
                // const sesCode = generateRandomNumber();
                emailText = `Dear Mr./Ms. ${emailMessage.name} ${emailMessage.lastName},<br><br>
                        We hope this message finds you well.<br><br>
                        We are sending you the security code to sign your loan agreement:<br>
                        <div style="width: 70%; padding: 30px; font-size: 3rem; 
                        font-weight: bold; background-color: #e5f6d6; margin: 30px auto; text-align: center;">${emailMessage.sesCode}</div>
                        <br>
                        Please visit the following <a href="#">link</a> to submit the code and your application ID.
                        <br><br>
                        Best regards,<br><br>
                        Customer Service Team,<br><br>
                        TU Bank<br><br>
                        <img src="${logoPath} alt="logo" style="width: 100px; height: 100px; magrin: 10px auto">`;
                break;
            case 'credit-issued':
                emailText = `Dear ${emailMessage.name} ${emailMessage.lastName},<br><br>
                    We would like to inform you that your loan application has been processed successfully.
                    <br><br>
                    Best regards,<br><br>
                    Customer Service Team,<br><br>
                    TU Bank<br>
                    <img src="${logoPath} alt="logo" style="width: 100px; height: 100px; magrin: 10px auto">`;
                break;
            case 'application-denied':
                emailText = `Dear Mr./Ms. ${emailMessage.name} ${emailMessage.lastName},<br><br>
                    We regret to inform you that your application has been denied. 
                    Please contact our customer service for further information.
                    <br><br>
                    Best regards,<br><br>
                    Customer Service Team,<br><br>
                    TU Bank<br>
                    <img src="${logoPath} alt="logo" style="width: 100px; height: 100px; magrin: 10px auto">`;
                break;
        }
        if (!fs_1.default.existsSync('./files')) {
            fs_1.default.mkdirSync('./files');
        }
        fs_1.default.writeFileSync('./files/email.html', `<p">${emailText}</p>
      <img src="cid:logo" alt="Bank Logo" style="display: block; margin: 0 auto; width: 100px; height: 100px;" />`);
        let attachments = [
            {
                filename: 'logo.png',
                path: logoPath,
                cid: 'logo'
            }
        ];
        if (emailMessage.theme === 'send-documents') {
            attachments.push({
                filename: 'payment-schedule.txt',
                path: path_1.default.resolve(__dirname, '..', '..', 'files', 'payment-schedule.txt'),
                cid: 'payment-schedule@yourapp',
            }, {
                filename: 'credit-agreement.txt',
                path: path_1.default.resolve(__dirname, '..', '..', 'files', 'credit-agreement.txt'),
                cid: 'credit-agreement@yourapp',
            }, {
                filename: 'client-form.txt',
                path: path_1.default.resolve(__dirname, '..', '..', 'files', 'client-form.txt'),
                cid: 'client-form@yourapp',
            });
        }
        let mailOptions = {
            from: 'TU Bank "violetta.frontend@yandex.ru"',
            to: emailMessage.address,
            subject: emailMessage.theme,
            attachments: attachments,
            html: {
                path: './files/email.html'
            }
        };
        console.log('Mail options created.');
        let info = await transporter.sendMail(mailOptions);
        logger_1.logger.info('Email sent: ' + info.response);
    }
    catch (err) {
        logger_1.logger.error('Error in sendEmail: ', err);
    }
}
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.service.js.map