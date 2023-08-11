import { db } from '../db.js';
import { ConflictError } from '../errors/errorClasses.js';
import { logger } from '../helpers/logger.js';
import { v4 as uuidv4 } from 'uuid';
export async function addClientAndPassport(loanApplication) {
    try {
        const existingClient = await db.oneOrNone('SELECT * FROM client JOIN passport ON client.passport_id = passport.passport_id WHERE passport.series = $1 AND passport.number = $2', [loanApplication.passportSeries, loanApplication.passportNumber]);
        if (existingClient) {
            throw new ConflictError('Клиент с данным паспортом уже существует');
        }
        const passportId = uuidv4();
        await db.none('INSERT INTO passport(passport_id, series, number) VALUES($1, $2, $3)', [passportId, loanApplication.passportSeries, loanApplication.passportNumber]);
        const result = await db.one('INSERT INTO client(last_name, first_name, middle_name, birth_date, email, passport_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING client_id', [
            loanApplication.lastName,
            loanApplication.firstName,
            loanApplication.middleName,
            loanApplication.birthdate,
            loanApplication.email,
            passportId
        ]);
        return result.client_id;
    }
    catch (error) {
        logger.error(`Error while adding client and passport: ${error}`);
        throw error;
    }
}
//# sourceMappingURL=application.service.js.map