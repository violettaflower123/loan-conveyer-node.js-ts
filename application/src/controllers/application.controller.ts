import { prescoring } from "../services/loanOffers.js";
import axios, { AxiosError} from "axios";
import { LoanApplicationRequestDTO, LoanOfferDTO } from "../dtos.js";
import express, { Request, Response } from 'express';

export const postApplication = async (req: Request, res: Response) => {
    try {
        const loanApplicationRequest: LoanApplicationRequestDTO = req.body;
        if (!prescoring(loanApplicationRequest)){
            throw new Error("Invalid request data.");
        }
        console.log('here')
        const response = await axios.post('http://api-deals:3002/deal/application', loanApplicationRequest);
        if (!response.data) {
            throw new Error('Application not found.');
        }

        return res.json(response.data);  
    } catch (err) {
        const error = err as AxiosError;
        console.log(err);
        if (error.response) {
            const responseData = error.response.data as { message: string };
            console.log('data111111', responseData)
            return res.status(400).json({ error: responseData || error.message });
        }
        return res.status(400).json({ error: error.message });
    }
}