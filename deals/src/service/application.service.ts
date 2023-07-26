import { LoanApplicationRequestDTO } from '../dtos.js';
import { db } from '../db.js';

export function validateLoanApplication(loanApplication: LoanApplicationRequestDTO) {
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

export async function addClientAndPassport(loanApplication: LoanApplicationRequestDTO) {
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
