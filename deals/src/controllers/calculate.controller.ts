import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { FinishRegistrationRequestDTO, ScoringDataDTO, CreditDTO, ChangeType, Status, CreditStatus } from "../dtos.js";
import { getFromDb, createScoringDataDTO,
    saveCreditToDb, saveApplication, updateApplicationStatusAndHistory } from "../services/calculate.service.js";

export const calculateCredit = async (req: Request, res: Response, next: NextFunction) => {
        try {
        const applicationId = req.params.applicationId;
        const finishRegistrationData: FinishRegistrationRequestDTO = req.body;
        
        const application = await getFromDb('application', applicationId);

        const clientId = JSON.parse(application.client_id);
    
        if (!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }

        const client = await getFromDb('client', clientId);

        if (!client) {
            throw new Error('Client not found.');
        }

        const passport = await getFromDb('passport', client.passport_id);

        if (!passport) {
            throw new Error('Passport not found.');
        }

        const scoringData: ScoringDataDTO = createScoringDataDTO(finishRegistrationData, application, client, passport); 

        const scoringResponse = await axios.post('http://api-conveyer:3001/conveyor/calculation', scoringData);
        const creditDTO: CreditDTO = scoringResponse.data;
        
        creditDTO.status = CreditStatus.Calculated;
        console.log('creditDTO', creditDTO);

        if (scoringResponse.status != 200) {
            return res.status(400).json({ message: 'Scoring failed.' });
        }

        const savedCredit = await saveCreditToDb(creditDTO);
        console.log('Saved Credit:', savedCredit);
        application.creditId = savedCredit;
        application.id = applicationId;
        await updateApplicationStatusAndHistory(application, Status.Approved, ChangeType.Automatic);
        console.log('Credit ID before saving application: ', application.creditId);
        await saveApplication(application);  
        console.log('application', application);

        return res.json({ message: 'Application status updated successfully.' });
    } catch (err: any) {
        console.log('Error!!');
        next(err);
        const error = err as Error;
        if ('response' in err) {
            console.log('aaaa', err.response.data);
            return res.status(400).json({ error: err.response.data });
        }
        return res.status(400).json({ error: error.message });

    }
};