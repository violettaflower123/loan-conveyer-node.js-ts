// import nodemailer from 'nodemailer';

// interface MailOptions {
//   from: string;
//   to: string;
//   subject: string;
//   text: string;
// }

// // Создайте переносимый объект SMTP с параметрами по умолчанию
// const transporter = nodemailer.createTransport({
//   host: 'smtp.yandex.ru',
//   port: 465,
//   secure: true, // true для 465, false для других портов
//   auth: {
//     user: 'violetta.frontend@yandex.ru', 
//     pass: 'Istanbul209!', 
//   },
// });

// export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
//   const mailOptions: MailOptions = {
//     from: '"BANK" violetta.frontend@yandex.ru', // отправитель
//     to: to, // список получателей
//     subject: subject, // тема
//     text: text, // текстовое тело
//   };

//   try {
//     // Отправка электронной почты
//     const info = await transporter.sendMail(mailOptions);

//     console.log(`Email sent: ${info.messageId}`);
//   } catch (error) {
//     console.error(`Error: ${error}`);
//   }
// };
