import { db } from '../db.js';
import { ConflictError } from '../errors/errorClasses.js';
import { logger } from '../helpers/logger.js';
export async function addClientAndPassport(loanApplication) {
    const passportId = loanApplication.passportSeries + loanApplication.passportNumber;
    try {
        const result = await db.tx(async (t) => {
            const existingClient = await t.oneOrNone('SELECT * FROM client WHERE passport_id = $1', [passportId]);
            if (existingClient) {
                throw new ConflictError('Клиент с данным паспортом уже существует');
            }
            const passport = await t.oneOrNone('SELECT * FROM passport WHERE passport_id = $1', [passportId]);
            if (!passport) {
                await t.none('INSERT INTO passport(passport_id, series, number) VALUES($1, $2, $3)', [passportId, loanApplication.passportSeries, loanApplication.passportNumber]);
            }
            const result = await t.one('INSERT INTO client(last_name, first_name, middle_name, birth_date, email, passport_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING client_id', [
                loanApplication.lastName,
                loanApplication.firstName,
                loanApplication.middleName,
                loanApplication.birthdate,
                loanApplication.email,
                passportId
            ]);
            console.log(result);
            return result.client_id;
        });
        return result;
    }
    catch (error) {
        logger.error(error);
        throw error;
    }
}
//# sourceMappingURL=application.service.js.map