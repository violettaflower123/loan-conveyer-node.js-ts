import { producer, getFromDb, sendMessage } from "../service/kafka.service.js";
import { MessageThemes } from "../types/types.js";
import { BadRequestError, ServerError, ConflictError, ValidationError, AuthorizationError, ResourceNotFoundError } from "../errors/errorClasses.js";
import { getStatusId, updateCreditStatus, updateApplication } from "../service/sendCode.service.js";
export const sendCode = async (req, res) => {
    // в req что-то типа {  "code": "755787"   }
    try {
        const applicationId = req.params.applicationId;
        const application = await getFromDb('application', applicationId);
        const creditId = application.credit_id;
        const clientId = JSON.parse(application.client_id);
        const client = await getFromDb('client', clientId);
        const credit = await getFromDb('credit', creditId);
        // console.log('', credit, '2', application), '3', client;
        const code = req.body.code;
        if (!code || typeof code !== 'string' || code.length !== 6) {
            throw new BadRequestError('Code must be a 6-digit string');
        }
        if (code !== application.ses_code) {
            throw new BadRequestError('Your code is incorrect.');
        }
        const creditStatusId = await getStatusId('ISSUED');
        await updateCreditStatus(creditId, creditStatusId);
        await updateApplication(applicationId, 'CREDIT_ISSUED', code);
        await producer.connect();
        const message = {
            address: client.email,
            theme: MessageThemes.CreditIssued,
            applicationId: applicationId,
            name: client.first_name,
            lastName: client.last_name
        };
        sendMessage('credit-issued', message);
        res.status(200).send('Success! Credit has been issued.');
    }
    catch (err) {
        const error = err;
        console.log(error);
        if (error instanceof BadRequestError ||
            error instanceof ConflictError ||
            error instanceof ResourceNotFoundError ||
            error instanceof AuthorizationError ||
            error instanceof ValidationError ||
            error instanceof ServerError) {
            res.status(error.statusCode).send({
                message: error.message
            });
        }
        else {
            res.status(500).send({
                message: 'An unexpected error occurred.',
                error: error.message
            });
        }
    }
};
//# sourceMappingURL=sendCode.controller.js.map