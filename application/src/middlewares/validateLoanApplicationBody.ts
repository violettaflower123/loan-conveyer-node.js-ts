import Joi, {ValidationResult} from "joi";
import { differenceInYears, isValid } from "date-fns";
import { BadRequestError } from "../errors/errorClasses.js";
import { LoanApplicationRequestDTO, EmailMessage } from "../dtos.js";
import { Request, Response, NextFunction } from "express";
import { Kafka } from "kafkajs";
import { MessageThemes } from "../types/types.js";


export const kafka = new Kafka({
        clientId: 'deal-service',
        brokers: ['kafka-broker-1:19092'],
      });

export const producer = kafka.producer();

export const sendMessage = async (topic: string, message: EmailMessage) => {
try {
    await producer.send({
    topic: topic,
    messages: [
        {
        value: JSON.stringify(message),
        },
    ],
    });
    console.log('Сообщение успешно отправлено в топик: ', topic);
    await producer.disconnect();
} catch (error) {
    console.error('Ошибка при отправке сообщения: ', error);
}
};

const schema = Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    middleName: Joi.string().min(2).max(30).optional(),
    amount: Joi.number().min(10000).required(),
    term: Joi.number().integer().min(6).required(), 
    birthdate: Joi.date().custom((value, helpers) => {
        const today = new Date();
        const age = differenceInYears(today, value);
        if (age < 18) return helpers.error('any.invalid');
        if (!isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }, 'Age validation').required(),
    email: Joi.string().email().pattern(/.+@.+\..+/).required(),
    passportSeries: Joi.string().length(4).pattern(/[0-9]{4}/).required(),
    passportNumber: Joi.string().length(6).pattern(/[0-9]{6}/).required()
});


export const validateLoanApplicationBody = async (req: Request, res: Response, next: NextFunction) => {
    const { error }: ValidationResult<LoanApplicationRequestDTO> = schema.validate(req.body);
    console.log(req.body)

    if (error) {
        await producer.connect();
        const message: EmailMessage = {
        address: req.body.email,
        theme: MessageThemes.ApplicationDenied, 
        name: req.body.firstName,
        lastName: req.body.lastName
        };
        sendMessage('application-denied', message);

        next(new BadRequestError(error.details[0].message)); // передаем ошибку обработчику ошибок Express
        return;
    }

    next();
};
