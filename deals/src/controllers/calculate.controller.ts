import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { FinishRegistrationRequestDTO, ScoringDataDTO, Credit } from "../dtos.js";
import { ChangeType, Status, CreditStatus } from "../types/types.js";

import { getFromDb, createScoringDataDTO, 
    saveCreditToDb, saveApplication, updateApplicationStatusAndHistory } from "../service/calculate.service.js";
import { BadRequestError, ServerError, ConflictError, AuthorizationError, ValidationError, ResourceNotFoundError } from '../errors/errorClasses.js';


export const calculateCredit = async (req: Request, res: Response, next: NextFunction) => {
        try {
        const applicationId = req.params.applicationId;
        const finishRegistrationData: FinishRegistrationRequestDTO = req.body;
        
        const application = await getFromDb('application', applicationId);

        const clientId = JSON.parse(application.client_id);
    
        if (!application) {
            throw new ResourceNotFoundError('Application not found.');
        }

        const client = await getFromDb('client', clientId);

        if (!client) {
            throw new ResourceNotFoundError('Client not found.');
        }

        const passport = await getFromDb('passport', client.passport_id);

        if (!passport) {
            throw new ResourceNotFoundError('Passport not found.');
        }

        const scoringData: ScoringDataDTO = createScoringDataDTO(finishRegistrationData, application, client, passport); 

        const scoringResponse = await axios.post('http://api-conveyer:3001/conveyor/calculation', scoringData);
        const creditDTO: Credit = scoringResponse.data;
        
        creditDTO.status = CreditStatus.Calculated;

        if (scoringResponse.status != 200) {
            throw new ServerError('Scoring failed.');
        }

        const savedCredit = await saveCreditToDb(creditDTO);
        application.credit_id = savedCredit;
        application.application_id = applicationId;

        await updateApplicationStatusAndHistory(application, Status.Approved, ChangeType.Automatic);
        await saveApplication(application);  
        
        console.log('application', application);

        return res.json({ message: 'Application status updated successfully.' });
    } catch (err) {
        console.log('aaaa', err)
        next(err);
    }
};