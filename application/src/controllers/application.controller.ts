import { prescoring } from "../services/loanOffers.js";
import axios, { AxiosError} from "axios";
import { LoanApplicationRequestDTO, LoanOfferDTO } from "../dtos.js";
import express, { NextFunction, Request, Response } from 'express';
import { ResourceNotFoundError } from "../errors/errorClasses.js";

export const postApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loanApplicationRequest: LoanApplicationRequestDTO = req.body;

        const response = await axios.post('http://api-deals:3002/deal/application', loanApplicationRequest);
        if (!response.data) {
            throw new ResourceNotFoundError('Application not found.');
        }

        return res.json(response.data);  
    } catch (err) {
        if (err instanceof AxiosError) {
            const error = err as AxiosError;
            console.log(err);
            if (error.response) {
                const responseData = error.response.data as { message: string };
                console.log('data111111', error.response.status)
                return res.status(error.response.status).json({ error: responseData || error.message });
            }
            return res.status(400).json({ error: error.message }); 
        } else {
            next();
        }
    }
}