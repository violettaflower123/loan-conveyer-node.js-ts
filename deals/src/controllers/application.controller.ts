import { Request, Response, NextFunction } from 'express';
import { LoanApplicationRequestDTO, LoanOfferDTO } from '../dtos.js';
import { validateLoanApplication, addClientAndPassport } from '../service/application.service.js';
import axios from 'axios';
import { db, pgp } from '../db.js';
import pgPromise from 'pg-promise';
import { BadRequestError, ServerError, ConflictError, AuthorizationError, ValidationError, ResourceNotFoundError } from '../errors/errorClasses.js';


export const postApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loanApplication: LoanApplicationRequestDTO = req.body;

        const validationResult = validateLoanApplication(loanApplication); 
        console.log('validation', validationResult);
        if (!validationResult.isValid) {
            return res.status(400).json({ error: validationResult.errorMessage });
        };
        
        const clientId = await addClientAndPassport(loanApplication); 
        console.log('client', clientId)

        const applicationResult = await db.one('INSERT INTO application(client_id, creation_date, status) VALUES($1, $2, $3) RETURNING application_id',
            [clientId, new Date(), 'PREAPPROVAL']);
        const applicationId = applicationResult.application_id; 

        const response = await axios.post('http://api-conveyer:3001/conveyor/offers', loanApplication);

        if (!response.data) {
            throw new Error('Не удалось получить предложения о кредите');
        }

        const loanOffers: LoanOfferDTO[] = response.data.map((offer: LoanOfferDTO) => {
            return { ...offer, applicationId: applicationId };
        });

        res.status(200).json(loanOffers);
    } 
    // catch (err) {
    //     const error = err as Error;
    //     if (error instanceof BadRequestError) {
    //         return res.status(400).json({ error: error.message });
    //     } else if (error instanceof AuthorizationError) {
    //         return res.status(401).json({ error: error.message });
    //     } else if (error instanceof ValidationError) {
    //         return res.status(403).json({ error: error.message });
    //     } else if (error instanceof ResourceNotFoundError) {
    //         return res.status(404).json({ error: error.message });
    //     } else if (error instanceof ConflictError) {
    //         return res.status(409).json({ error: error.message });
    //     } else if (error instanceof ServerError) {
    //         return res.status(500).json({ error: error.message });
    //     } else {
    //         return res.status(500).json({ error: "Unexpected error occurred" });
    //     }
    // }
    catch (error: any) {
        next(error);
        console.log(error)
        if (error instanceof pgPromise.errors.QueryResultError) {
            return res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных.' });
        } else if (error.message === 'Не удалось получить предложения о кредите') {
            return res.status(500).json({ error: 'Не удалось получить предложения о кредите с API Conveyor.' });
        } else if (error.message === 'Клиент с данным паспортом уже существует') {
            return res.status(400).json({ error: error.message });
        } else {
            if ('response' in error) {
                console.log(error.response.data);
                return res.status(400).json({ error: error.response.data.error });
            }
        }
    }
}