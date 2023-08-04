import { addClientAndPassport } from '../service/application.service.js';
import axios from 'axios';
import { db } from '../db.js';
import pgPromise from 'pg-promise';
import { BadRequestError, ServerError, ConflictError, AuthorizationError, ValidationError, ResourceNotFoundError } from '../errors/errorClasses.js';
export const postApplication = async (req, res, next) => {
    try {
        const loanApplication = req.body;
        const clientId = await addClientAndPassport(loanApplication);
        console.log('client', clientId);
        const applicationResult = await db.one('INSERT INTO application(client_id, creation_date, status) VALUES($1, $2, $3) RETURNING application_id', [clientId, new Date(), 'PREAPPROVAL']);
        const applicationId = applicationResult.application_id;
        const response = await axios.post('http://api-conveyer:3001/conveyor/offers', loanApplication);
        if (!response.data) {
            throw new ServerError('Не удалось получить предложения о кредите с API Conveyor.');
        }
        const loanOffers = response.data.map((offer) => {
            return { ...offer, applicationId: applicationId };
        });
        res.status(200).json(loanOffers);
    }
    catch (error) {
        console.log(error);
        if (error instanceof pgPromise.errors.QueryResultError) {
            return res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных.' });
        }
        else if (error.message === 'Клиент с данным паспортом уже существует') {
            return res.status(400).json({ error: error.message });
        }
        if (error instanceof BadRequestError) {
            return res.status(400).json({ error: error.message });
        }
        else if (error instanceof AuthorizationError) {
            return res.status(401).json({ error: error.message });
        }
        else if (error instanceof ValidationError) {
            return res.status(403).json({ error: error.message });
        }
        else if (error instanceof ResourceNotFoundError) {
            return res.status(404).json({ error: error.message });
        }
        else if (error instanceof ConflictError) {
            return res.status(409).json({ error: error.message });
        }
        else if (error.message === 'Не удалось получить предложения о кредите') {
            return res.status(500).json({ error: 'Не удалось получить предложения о кредите с API Conveyor.' });
        }
        else {
            if ('response' in error) {
                console.log(error.response.data);
                return res.status(400).json({ error: error.response.data.error });
            }
            else {
                // Если не удаётся определить тип ошибки, возвращаем 500 Internal Server Error
                return res.status(500).json({ error: 'Внутренняя ошибка сервера.' });
            }
        }
    }
};
//# sourceMappingURL=application.controller.js.map