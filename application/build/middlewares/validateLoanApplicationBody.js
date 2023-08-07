import Joi from "joi";
import { differenceInYears, isValid as isValidDate } from "date-fns";
import { BadRequestError } from "../errors/errorClasses.js";
import { Kafka } from "kafkajs";
import { MessageThemes } from "../types/types.js";
import { logger } from "../helpers/logger.js";
export const kafka = new Kafka({
    clientId: 'deal-service',
    brokers: ['kafka-broker-1:19092'],
});
export const producer = kafka.producer();
export const sendMessage = async (topic, message) => {
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
        logger.info('Сообщение успешно отправлено');
        await producer.disconnect();
    }
    catch (error) {
        logger.error('Ошибка при отправке сообщения: ', error);
    }
};
const schema = Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    middleName: Joi.string().min(2).max(30).optional(),
    amount: Joi.number().strict().integer().greater(9999).required(),
    term: Joi.number().strict().integer().min(6).required(),
    birthdate: Joi.date().custom((value, helpers) => {
        const today = new Date();
        const age = differenceInYears(today, value);
        if (age < 18 || !isValidDate(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }, 'Age validation').required(),
    email: Joi.string().email({
        tlds: { allow: true }
    }).required(),
    passportSeries: Joi.string().length(4).pattern(/[0-9]{4}/).required(),
    passportNumber: Joi.string().length(6).pattern(/[0-9]{6}/).required()
});
export const validateLoanApplicationBody = async (req, res, next) => {
    logger.info('Получен запрос на валидацию заявки на кредит:', req.body);
    const { error } = schema.validate(req.body);
    if (error) {
        logger.warn('Ошибка валидации:', error);
        await producer.connect();
        const message = {
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
//# sourceMappingURL=validateLoanApplicationBody.js.map