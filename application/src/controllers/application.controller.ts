import axios, { AxiosError} from "axios";
import { LoanApplicationRequestDTO, LoanOfferDTO } from "../dtos.js";
import express, { NextFunction, Request, Response } from 'express';
import { ResourceNotFoundError, AuthorizationError } from "../errors/errorClasses.js";
import { logger } from "../helpers/logger.js";
import { postApplicationToApiDeals } from "../api/apiDeals.js";
interface RequestWithJWT extends Request {
    email?: string;
}


export const postApplication = async (req: RequestWithJWT, res: Response, next: NextFunction) => {
    try {
        const loanApplicationRequest: LoanApplicationRequestDTO = req.body;

        logger.info('Received a loan application request:', loanApplicationRequest);
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new AuthorizationError('Token required');
        }
        const emailFromToken = req.email;
        logger.info("Inside postApplication. req.email:", req.email);


        if(emailFromToken !== loanApplicationRequest.email) {
            throw new AuthorizationError('Укажите тот же email, что и при регистрации.');
        }

        const response = await postApplicationToApiDeals(loanApplicationRequest, token);

        if (!response.data) {
            logger.warn('Application not found.');
            throw new ResourceNotFoundError('Application not found.');
        }
        logger.info('Successfully processed the loan application request.');
        return res.json(response.data);  
    } catch (err) {
        if (err instanceof AuthorizationError) {
            return res.status(401).json({ error: err.message });
          }
        
          if (err instanceof AxiosError) {
            const error = err as AxiosError;
            logger.error('Error occurred while processing the loan application:', error);
      
            if (error.response) {
              const responseData = error.response.data as { message: string };
              return res.status(error.response.status).json({ error: responseData || error.message });
            }
            return res.status(400).json({ error: error.message });
          } else {
            logger.error('An unexpected error occurred while processing the loan application:', err);
            next();
          }
    }
}