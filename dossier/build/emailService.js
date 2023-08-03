"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Создайте переносимый объект SMTP с параметрами по умолчанию
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'violetta.frontend@yandex.ru',
        pass: 'Istanbul209!',
    },
});
const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: '"BANK" violetta.frontend@yandex.ru',
        to: to,
        subject: subject,
        text: text, // текстовое тело
    };
    try {
        // Отправка электронной почты
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
    }
    catch (error) {
        console.error(`Error: ${error}`);
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=emailService.js.map