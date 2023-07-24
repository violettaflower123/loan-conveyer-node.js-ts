import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import pgPromise from 'pg-promise';
import axios from 'axios';
import { LoanApplicationRequestDTO, LoanOfferDTO, 
    CreditDTO, ScoringDataDTO, 
    FinishRegistrationRequestDTO, PassportDTO, 
    ApplicationDTO, CreditStatus,
    Status, ChangeType, ApplicationStatusHistoryDTO} from './dtos.js';
import Joi from "joi";

const app = express();
app.use(bodyParser.json());

const pgp = pgPromise();
const db = pgp('postgres://postgres:password@postgres:5432/deals');

app.use(function(err: any, req: Request, res: Response, next: Function) {
    // console.error(err.stack); 
    if (err instanceof pgPromise.errors.QueryResultError) {
        return res.status(500).json({ error: 'Database query error.' });
    }

    if ('response' in err) {
        console.log(err.response.data);
        return res.status(400).json({ error: err.response.data.error });
    }

    return res.status(500).json({ error: 'An unexpected error occurred.' });
});


app.post('/deal/application', async (req: Request, res: Response, next: Function) => {
    try {
        const loanApplication: LoanApplicationRequestDTO = req.body;

        const validationResult = validateLoanApplication(loanApplication); 
        console.log('validation', validationResult);
        if (!validationResult.isValid) {
            return res.status(400).json({ error: validationResult.errorMessage });
        };

        async function addClientAndPassport(loanApplication: LoanApplicationRequestDTO) {
            const passportId = loanApplication.passportSeries + loanApplication.passportNumber;
        
            let passport = await db.oneOrNone('SELECT * FROM passport WHERE passport_id = $1', [passportId]);
            if (!passport) {
                passport = await db.one(
                    'INSERT INTO passport(passport_id, series, number) VALUES($1, $2, $3) RETURNING passport_id',
                    [passportId, loanApplication.passportSeries, loanApplication.passportNumber]
                );
            }
        
            const existingClient = await db.oneOrNone('SELECT * FROM client WHERE passport_id = $1', [passportId]);
        
            if (existingClient) {
                throw new Error('Клиент с данным паспортом уже существует');
            }
        
            const result = await db.one(
                'INSERT INTO client(last_name, first_name, middle_name, birth_date, email, passport_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING client_id',
                [loanApplication.lastName, loanApplication.firstName, loanApplication.middleName, loanApplication.birthdate, loanApplication.email, passport.passport_id]
            );
        
            return result.client_id;
        }
        
        const clientId = await addClientAndPassport(loanApplication); 

        const applicationResult = await db.one('INSERT INTO application(client_id, creation_date, status) VALUES($1, $2, $3) RETURNING application_id',
            [clientId, new Date(), 'PREAPPROVAL']);
        const applicationId = applicationResult.application_id; 

        console.log('data', loanApplication, applicationResult)

        const response = await axios.post('http://api-conveyer:3001/conveyor/offers', loanApplication);

        if (!response.data) {
            throw new Error('Не удалось получить предложения о кредите');
        }

        const loanOffers: LoanOfferDTO[] = response.data.map((offer: LoanOfferDTO) => {
            return { ...offer, applicationId: applicationId };
        });

        res.status(200).json(loanOffers);
    } catch (error: any) {
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
});

function validateLoanApplication(loanApplication: LoanApplicationRequestDTO) {
    const { lastName, firstName, middleName, email } = loanApplication;

    if (!lastName || !firstName || !middleName || !email) {
        return {
            isValid: false,
            errorMessage: 'Все поля должны быть заполнены.'
        };
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        return {
            isValid: false,
            errorMessage: 'Предоставлен недействительный адрес электронной почты.'
        };
    }

    return {
        isValid: true,
    };
}

app.put('/deal/offer', async (req: Request, res: Response, next: Function) => {
    try {
        const loanOffer: LoanOfferDTO = req.body;
        console.log('offer', loanOffer)
        
        const application = await db.one('SELECT * FROM application WHERE application_id = $1', [loanOffer.applicationId]);
        console.log('application', application);

        if (!application) {
            throw new Error(`Application with id ${loanOffer.applicationId} not found.`);
        }

        const updatedStatusHistory = [...(application.status_history || []), {
            status: "APPROVED",
            time: new Date(),
            changeType: "MANUAL"
        }];        

        const updateApplication = await db.one('UPDATE application SET status = $1, status_history = $2, applied_offer = $3 WHERE application_id = $4 RETURNING *',
            ["APPROVED", JSON.stringify(updatedStatusHistory), JSON.stringify(loanOffer), loanOffer.applicationId]);

        res.status(200).json(updateApplication);
    } catch (err) {
        console.log('Error!!');
        const error = err as Error;
        return res.status(400).json({ error: error.message });
        
    }
});

async function getFromDb(table: string, id: string){
    const query = `SELECT * FROM ${table} WHERE ${table}_id = $1`;
    const result = await db.one(query, [id]);
    return result;
}

function createScoringDataDTO(finishRegistrationData: FinishRegistrationRequestDTO, application: any, client: any, passport: PassportDTO): ScoringDataDTO {
    const appliedOffer = JSON.parse(application.applied_offer);
    const scoringData: ScoringDataDTO = {
        amount: appliedOffer.requestedAmount, 
        term: appliedOffer.term, 
        firstName: client.first_name, 
        lastName: client.last_name, 
        middleName: client.middle_name, 
        email: client.email, 
        birthdate: client.birth_date, 
        passportSeries: passport.series, 
        passportNumber: passport.number, 
        gender: finishRegistrationData.gender,
        passportIssueDate: finishRegistrationData.passportIssueDate,
        passportIssueBranch: finishRegistrationData.passportIssueBranch, 
        maritalStatus: finishRegistrationData.maritalStatus,
        dependentNumber: finishRegistrationData.dependentNumber,
        employment: finishRegistrationData.employment,
        account: finishRegistrationData.account,
        isInsuranceEnabled: appliedOffer.isInsuranceEnabled, 
        isSalaryClient: appliedOffer.isSalaryClient 
    };
    console.log('scoring Data', scoringData);
    return scoringData;
}
async function getStatusId(status: string){
    const query = `SELECT id FROM credit_status WHERE credit_status = $1`;
    const result = await db.one(query, [status]);
    return result.id;
}

const saveCreditToDb = async (credit: CreditDTO) => {
    const query = `
      INSERT INTO credit (
          amount,
          term,
          monthly_payment,
          rate,
          psk,
          payment_schedule,
          insurance_enable,
          salary_client,
          credit_status_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING credit_id;
    `;
    const statusId = await getStatusId(credit.status);
    const values = [
      credit.amount,
      credit.term,
      credit.monthlyPayment,
      credit.rate,
      credit.psk,
      JSON.stringify(credit.paymentSchedule),
      credit.isInsuranceEnabled,
      credit.isSalaryClient,
      statusId,
    ];
  
    try {
      const credit = await db.one(query, values);
      return credit.credit_id;
    } catch (err) {
    const error = err as Error;
      console.error('Error executing query', error.stack);
      throw err;
    }
  };

async function saveApplication(application: ApplicationDTO) {
    const query = `UPDATE application SET status = $1, status_history = $2 WHERE application_id = $3`;
    const savedApplication = await db.none(query, [application.status, JSON.stringify(application.statusHistory), application.id]);
    return savedApplication;
}

async function saveStatusHistoryToDb(historyRecord: ApplicationStatusHistoryDTO) {
    try {
        const changeTypeId = await getChangeTypeIdFromDb(historyRecord.changeType);
        const query = `INSERT INTO status_history(status, time, change_type_id) VALUES($1, $2, $3) RETURNING *;`;
        const values = [historyRecord.status, historyRecord.time, changeTypeId];
        const result = await db.one(query, values);
        console.log('result', result)
        return result; 
    } catch (err) {
        console.error('Ошибка при сохранении истории статуса:', err);
        throw err; 
    }
}

async function getChangeTypeIdFromDb(changeType: ChangeType) {
    const query = `SELECT id FROM change_type WHERE change_type = $1;`;
    const result = await db.one(query, changeType);
    return result.id;
}

async function updateApplicationStatusAndHistory(application: ApplicationDTO, newStatus: Status, changeType: ChangeType) {
    const now = new Date();
    const historyRecord: ApplicationStatusHistoryDTO = {
        status: newStatus,
        time: now.toISOString(),
        changeType: changeType,
    };
    const statusHistoryId = await saveStatusHistoryToDb(historyRecord);
    console.log('status history id', statusHistoryId)

    // обновляем текущий статус заявки
    application.status = newStatus;
}
  

app.put('/deal/calculate/:applicationId', async (req: Request, res: Response, next: Function) => {
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

        application.credit_id = savedCredit;
        await updateApplicationStatusAndHistory(application, Status.Approved, ChangeType.Automatic);
        await saveApplication(application);  

        return res.json({ message: 'Application status updated successfully.' });
    } catch (err: any) {
        console.log('Error!!');
        const error = err as Error;
        if ('response' in err) {
            console.log(err.response.data);
            return res.status(400).json({ error: err.response.data.error });
        }
        return res.status(400).json({ error: error.message });

    }
 
});



const port: number = 3002;
app.listen((port), () => {
    console.log(`Server is running on http://localhost:${port}`)
})
