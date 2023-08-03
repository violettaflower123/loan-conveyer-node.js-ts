import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { FinishRegistrationRequestDTO, ScoringDataDTO, Credit } from "../dtos.js";
import { ChangeType, Status, CreditStatus } from "../types/types.js";

import { getFromDb, createScoringDataDTO, 
    saveCreditToDb, saveApplication, updateApplicationStatusAndHistory, updateClient, saveEmploymentToDb } from "../service/calculate.service.js";
import { ServerError, ResourceNotFoundError } from '../errors/errorClasses.js';
import { Kafka } from 'kafkajs';
import { MessageThemes } from '../types/types.js';
import { EmailMessage } from '../dtos.js';
import { db } from "../db.js";


const kafka = new Kafka({
    clientId: 'deal-service',
    brokers: ['kafka-broker-1:19092'],
  });
  
  const producer = kafka.producer();
  
  const sendMessage = async (topic: string, message: EmailMessage) => {
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
        console.log('scoring data', scoringData);

        const scoringResponse = await axios.post('http://api-conveyer:3001/conveyor/calculation', scoringData);
        const creditDTO: Credit = scoringResponse.data;
        
        creditDTO.status = CreditStatus.Calculated;

        if (scoringResponse.status != 200) {
            throw new ServerError('Scoring failed.');
        }

        const employmentId = await saveEmploymentToDb(scoringData.employment);
        console.log('employment id', employmentId);

        await updateClient(clientId, scoringData.gender, scoringData.maritalStatus, scoringData.dependentNumber, employmentId);
        
        const savedCredit = await saveCreditToDb(creditDTO);
        application.credit_id = savedCredit;
        application.application_id = applicationId;


        await updateApplicationStatusAndHistory(application, Status.Approved, ChangeType.Automatic);
        await saveApplication(application);  

        await producer.connect();

        const message: EmailMessage = {
          address: client.email,
          theme: MessageThemes.CreateDocuments, 
          applicationId: applicationId,
          name: client.first_name,
          lastName: client.last_name
        };
        sendMessage('create-documents', message);
        

        return res.json({ message: 'Application status updated successfully.' });
    } catch (err) {
        console.log('aaaa', err)
        next(err);
    }
};