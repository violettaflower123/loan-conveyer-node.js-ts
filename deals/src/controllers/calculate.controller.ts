import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { FinishRegistrationRequestDTO, ScoringDataDTO, CreditDTO, PassportDTO, ApplicationDTO, 
    ApplicationStatusHistoryDTO, ChangeType, Status, CreditStatus } from "../dtos.js";

import { db } from "../db.js";
import { getFromDb, createScoringDataDTO, getStatusId, 
    saveCreditToDb, saveApplication, saveStatusHistoryToDb, updateApplicationStatusAndHistory } from "../service/calculate.service.js";

// async function getFromDb(table: string, id: string){
//     const query = `SELECT * FROM ${table} WHERE ${table}_id = $1`;
//     const result = await db.one(query, [id]);
//     return result;
// }

// function createScoringDataDTO(finishRegistrationData: FinishRegistrationRequestDTO, application: any, client: any, passport: PassportDTO): ScoringDataDTO {
//     const appliedOffer = JSON.parse(application.applied_offer);
//     const scoringData: ScoringDataDTO = {
//         amount: appliedOffer.requestedAmount, 
//         term: appliedOffer.term, 
//         firstName: client.first_name, 
//         lastName: client.last_name, 
//         middleName: client.middle_name, 
//         email: client.email, 
//         birthdate: client.birth_date, 
//         passportSeries: passport.series, 
//         passportNumber: passport.number, 
//         gender: finishRegistrationData.gender,
//         passportIssueDate: finishRegistrationData.passportIssueDate,
//         passportIssueBranch: finishRegistrationData.passportIssueBranch, 
//         maritalStatus: finishRegistrationData.maritalStatus,
//         dependentNumber: finishRegistrationData.dependentNumber,
//         employment: finishRegistrationData.employment,
//         account: finishRegistrationData.account,
//         isInsuranceEnabled: appliedOffer.isInsuranceEnabled, 
//         isSalaryClient: appliedOffer.isSalaryClient 
//     };
//     console.log('scoring Data', scoringData);
//     return scoringData;
// }
// async function getStatusId(status: string){
//     const query = `SELECT id FROM credit_status WHERE credit_status = $1`;
//     const result = await db.one(query, [status]);
//     return result.id;
// }

// const saveCreditToDb = async (credit: CreditDTO) => {
//     const query = `
//       INSERT INTO credit (
//           amount,
//           term,
//           monthly_payment,
//           rate,
//           psk,
//           payment_schedule,
//           insurance_enable,
//           salary_client,
//           credit_status_id
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING credit_id;
//     `;
//     const statusId = await getStatusId(credit.status);
//     const values = [
//       credit.amount,
//       credit.term,
//       credit.monthlyPayment,
//       credit.rate,
//       credit.psk,
//       JSON.stringify(credit.paymentSchedule),
//       credit.isInsuranceEnabled,
//       credit.isSalaryClient,
//       statusId,
//     ];
  
//     try {
//       const credit = await db.one(query, values);
//       return credit.credit_id;
//     } catch (err) {
//     const error = err as Error;
//       console.error('Error executing query', error.stack);
//       throw err;
//     }
//   };

// async function saveApplication(application: ApplicationDTO) {
//     const updateQuery = `UPDATE application SET status = $1, status_history = $2, credit_id = $3 WHERE application_id = $4`;
//     await db.none(updateQuery, [application.status, JSON.stringify(application.statusHistory), application.creditId, application.id]);

//     const selectQuery = `SELECT * FROM application WHERE application_id = $1`;
//     const savedApplication = await db.oneOrNone(selectQuery, [application.id]);

//     if (savedApplication) {
//         console.log('savedApplication', savedApplication);
//     } else {
//         console.log('No data returned for application_id:', application.id);
//     }

//     return savedApplication;
// }

// async function saveStatusHistoryToDb(historyRecord: ApplicationStatusHistoryDTO) {
//     try {
//         const changeTypeId = await getChangeTypeIdFromDb(historyRecord.changeType);
//         const query = `INSERT INTO status_history(status, time, change_type_id) VALUES($1, $2, $3) RETURNING *;`;
//         const values = [historyRecord.status, historyRecord.time, changeTypeId];
//         const result = await db.one(query, values);
//         console.log('result', result)
//         return result; 
//     } catch (err) {
//         console.error('Ошибка при сохранении истории статуса:', err);
//         throw err; 
//     }
// }

// async function getChangeTypeIdFromDb(changeType: ChangeType) {
//     const query = `SELECT id FROM change_type WHERE change_type = $1;`;
//     const result = await db.one(query, changeType);
//     return result.id;
// }

// async function updateApplicationStatusAndHistory(application: ApplicationDTO, newStatus: Status, changeType: ChangeType) {
//     const now = new Date();
//     const historyRecord: ApplicationStatusHistoryDTO = {
//         status: newStatus,
//         time: now.toISOString(),
//         changeType: changeType,
//     };
//     const statusHistoryId = await saveStatusHistoryToDb(historyRecord);
//     console.log('status history id', statusHistoryId)

//     // обновляем текущий статус заявки
//     application.status = newStatus;
// }

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
            console.log(err.response.data);
            return res.status(400).json({ error: err.response.data.error });
        }
        return res.status(400).json({ error: error.message });

    }
};