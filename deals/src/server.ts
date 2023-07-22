import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import pgPromise from 'pg-promise';
import axios from 'axios';
import { LoanApplicationRequestDTO, LoanOfferDTO, CreditDTO, ScoringDataDTO, FinishRegistrationRequestDTO, PassportDTO } from './dtos.js';

const app = express();
app.use(bodyParser.json());

const pgp = pgPromise();
const db = pgp('postgres://postgres:password@postgres:5432/deals');

app.post('/deal/application', async (req: Request, res: Response) => {
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

app.put('/deal/offer', async (req: Request, res: Response) => {
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

async function getApplicationFromDb(applicationId: string) {
    const query = 'SELECT * FROM application WHERE application_id = $1';
    const application = await db.one(query, [applicationId]);
    return application;
}

async function getClientFromDb(clientId: string) {
    const query = 'SELECT * FROM client WHERE client_id = $1';
    const client = await db.one(query, [clientId]);
    return client;
}
async function getClientPassportFromDb(passportId: string) {
    const query = 'SELECT * FROM passport WHERE passport_id = $1';
    const passport = await db.one(query, [passportId]);
    return passport;
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
        passportIssueBranch: finishRegistrationData.passportIssueBrach, 
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
async function saveApplication(application: any) {
    const query = `UPDATE application SET status = $1, status_history = $2 WHERE application_id = $3`;
    const savedApplication = await db.none(query, [application.status, JSON.stringify(application.statusHistory), application.id]);
    return savedApplication;
}

app.put('/deal/calculate/:applicationId', async (req: Request, res: Response) => {
    try {
        const applicationId = req.params.applicationId;
        const finishRegistrationData: FinishRegistrationRequestDTO = req.body;
        console.log('registration data', finishRegistrationData);

        const application = await getApplicationFromDb(applicationId);
        console.log('applicationn 111', application);
        const clientId = JSON.parse(application.client_id);
        console.log('clini id', clientId);
    
        if (!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }

        const client = await getClientFromDb(clientId);
        console.log('client', client.passport_id);

        
        const passport = await getClientPassportFromDb(client.passport_id);
        console.log('123jgghjhjpassport', typeof passport.passport_id);

        const scoringData: ScoringDataDTO = createScoringDataDTO(finishRegistrationData, application, client, passport); 

        const scoringResponse = await axios.post('http://api-conveyer:3001/conveyor/calculation', scoringData);
        const creditDTO = scoringResponse.data;

        if (scoringResponse.status != 200) {
            return res.status(400).json({ message: 'Scoring failed.' });
        }

        const credit = creditDTO;
        credit.status = 'CALCULATED';

        application.status = 'CALCULATED';
        application.status_history.push({ status: 'CALCULATED', date: new Date() });

        console.log('final pplication', application);

        await saveApplication(application);  

        return res.json({ message: 'Application status updated successfully.' });
    } catch (err:any) {
        console.log('Error!!');
        console.error('erroooooor', err.response.data.message);
        const error = err as Error;
        return res.status(400).json({ error: err.response.data.message});
    }
 
});



const port: number = 3002;
app.listen((port), () => {
    console.log(`Server is running on http://localhost:${port}`)
})
