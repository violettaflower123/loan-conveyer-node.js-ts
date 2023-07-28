import { db } from "../db.js";
export async function getFromDb(table, id) {
    const query = `SELECT * FROM ${table} WHERE ${table}_id = $1`;
    const result = await db.one(query, [id]);
    return result;
}
export function createScoringDataDTO(finishRegistrationData, application, client, passport) {
    const appliedOffer = JSON.parse(application.applied_offer);
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
    console.log('scoring Data', scoringData);
    return scoringData;
}
export async function getStatusId(status) {
    const query = `SELECT id FROM credit_status WHERE credit_status = $1`;
    const result = await db.one(query, [status]);
    return result.id;
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
        console.error('Error executing query', error.stack);
        throw err;
    }
};
export async function saveApplication(application) {
    const updateQuery = `UPDATE application SET status = $1, status_history = $2, credit_id = $3 WHERE application_id = $4`;
    await db.none(updateQuery, [application.status, JSON.stringify(application.statusHistory), application.creditId, application.id]);
    const selectQuery = `SELECT * FROM application WHERE application_id = $1`;
    const savedApplication = await db.oneOrNone(selectQuery, [application.id]);
    if (savedApplication) {
        console.log('savedApplication', savedApplication);
    }
    else {
        console.log('No data returned for application_id:', application.id);
    }
    return savedApplication;
}
export async function getChangeTypeIdFromDb(changeType) {
    const query = `SELECT id FROM change_type WHERE change_type = $1;`;
    const result = await db.one(query, changeType);
    return result.id;
}
export async function saveStatusHistoryToDb(historyRecord) {
    try {
        const changeTypeId = await getChangeTypeIdFromDb(historyRecord.changeType);
        const query = `INSERT INTO status_history(status, time, change_type_id) VALUES($1, $2, $3) RETURNING *;`;
        const values = [historyRecord.status, historyRecord.time, changeTypeId];
        const result = await db.one(query, values);
        console.log('result', result);
        return result;
    }
    catch (err) {
        console.error('Ошибка при сохранении истории статуса:', err);
        throw err;
    }
}
export async function updateApplicationStatusAndHistory(application, newStatus, changeType) {
    const now = new Date();
    const historyRecord = {
        status: newStatus,
        time: now.toISOString(),
        changeType: changeType,
    };
    const statusHistoryId = await saveStatusHistoryToDb(historyRecord);
    console.log('status history id', statusHistoryId);
    application.status = newStatus;
}
//# sourceMappingURL=calculate.service.js.map