import { db } from "../db.js";
import { pgp } from "../db.js";
import { ServerError, ResourceNotFoundError } from "../errors/errorClasses.js";
import { logger } from "../helpers/logger.js";
import axios from "axios";
export async function getFromDb(table, id) {
    try {
        const query = `SELECT * FROM ${table} WHERE ${table}_id = $1`;
        const result = await db.one(query, [id]);
        return result;
    }
    catch (error) {
        logger.error('Error in getFromDb:', error);
        throw error;
    }
}
export function createScoringDataDTO(finishRegistrationData, application, client, passport) {
    const appliedOffer = JSON.parse(application.applied_offer);
    console.log(appliedOffer);
    const scoringData = {
        amount: appliedOffer.requestedAmount,
        term: appliedOffer.term,
        firstName: client.first_name,
        lastName: client.last_name,
        middleName: client.middle_name,
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
    return scoringData;
}
export async function getStatusId(status) {
    try {
        const query = `SELECT id FROM credit_status WHERE credit_status = $1`;
        const result = await db.one(query, [status]);
        return result.id;
    }
    catch (error) {
        logger.error('Error in getStatusId:', error);
        throw error;
    }
}
export const saveCreditToDb = async (credit) => {
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
    }
    catch (err) {
        const error = err;
        logger.error('Error executing query', error.stack);
        throw err;
    }
};
export async function getChangeTypeIdFromDb(changeType) {
    try {
        const query = `SELECT id FROM change_type WHERE change_type = $1;`;
        const result = await db.one(query, changeType);
        return result.id;
    }
    catch (error) {
        logger.error('Error in getChangeTypeIdFromDb:', error);
        throw error;
    }
}
export async function saveStatusHistoryToDb(historyRecord, application) {
    try {
        const applicationId = application.application_id;
        const changeTypeId = await getChangeTypeIdFromDb(historyRecord.changeType);
        const query = `INSERT INTO status_history(status, time, change_type_id, application_id) VALUES($1, $2, $3, $4) RETURNING *;`;
        const values = [historyRecord.status, historyRecord.time, changeTypeId, applicationId];
        const result = await db.one(query, values);
        return result;
    }
    catch (err) {
        logger.error('Ошибка при сохранении истории статуса:', err);
        throw err;
    }
}
export async function updateApplicationStatusAndHistory(application, newStatus, changeType) {
    try {
        const now = new Date();
        const historyRecord = {
            status: newStatus,
            time: now.toISOString(),
            changeType: changeType,
        };
        const statusHistoryId = await saveStatusHistoryToDb(historyRecord, application);
        if (!Array.isArray(application.status_history)) {
            application.status_history = [];
        }
        application.status_history.push(historyRecord);
        application.status = newStatus;
    }
    catch (error) {
        logger.error('Error in updateApplicationStatusAndHistory:', error);
        throw error;
    }
}
export async function saveApplication(application) {
    const updateQuery = `UPDATE application SET status = $1, status_history = $2, credit_id = $3 WHERE application_id = $4`;
    await db.none(updateQuery, [application.status, JSON.stringify(application.status_history), application.credit_id, application.application_id]);
    const selectQuery = `SELECT * FROM application WHERE application_id = $1`;
    const savedApplication = await db.oneOrNone(selectQuery, [application.application_id]);
    return savedApplication;
}
export async function updateClient(clientId, gender, maritalStatus, dependentNumber, employmentId, account) {
    try {
        const genderRow = await db.one("SELECT id FROM gender WHERE gender = $1", [gender]);
        const genderId = genderRow.id;
        const statusRow = await db.one("SELECT id FROM marital_status WHERE marital_status = $1", [maritalStatus]);
        const statusId = statusRow.id;
        const client = await db.one("UPDATE client SET gender_id = $1, marital_status_id = $2, dependent_amount = $3, employment_id = $4, account = $5 WHERE client_id = $6 RETURNING *", [genderId, statusId, dependentNumber, employmentId, account, clientId]);
        return client;
    }
    catch (error) {
        const message = `An error occurred: ${error.message} in Update Client`;
        let customError;
        if (error instanceof pgp.errors.QueryResultError) {
            customError = new ResourceNotFoundError(message);
        }
        else {
            customError = new ServerError(message);
        }
        logger.error(message);
        throw customError;
    }
}
async function getEmploymentStatusId(status) {
    const result = await db.one('SELECT id FROM employment_status WHERE employment_status = $1', [status]);
    return result.id;
}
async function getPositionId(position) {
    const result = await db.one('SELECT id FROM employment_position WHERE employment_position = $1', [position]);
    return result.id;
}
export async function saveEmploymentToDb(employmentData) {
    const employmentStatusId = await getEmploymentStatusId(employmentData.employmentStatus);
    const positionId = await getPositionId(employmentData.position);
    const query = `
    INSERT INTO employment (
        status_id, 
        employer_inn,
        salary,
        position_id,
        work_experience_total,
        work_experience_current
    ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING employment_id;
  `;
    const values = [
        employmentStatusId,
        employmentData.employerINN,
        employmentData.salary,
        positionId,
        employmentData.workExperienceTotal,
        employmentData.workExperienceCurrent,
    ];
    const result = await db.one(query, values);
    return result.employment_id;
}
export const updatePassport = async (passportBranch, passportIssuedate, passportId) => {
    try {
        await db.none('UPDATE passport SET issue_branch = $1, issue_date = $2 WHERE passport_id = $3', [passportBranch, passportIssuedate, passportId]);
        logger.info('Запись в таблице passport успешно обновлена');
    }
    catch (error) {
        logger.error('Произошла ошибка:', error);
    }
};
export const getScoringResponse = async (scoringData) => {
    try {
        return await axios.post('http://api-conveyer:3001/conveyor/calculation', scoringData);
    }
    catch (error) {
        logger.error(`Scoring request failed`, error);
        throw new ServerError('Scoring service unavailable.');
    }
};
//# sourceMappingURL=calculate.service.js.map