import { MessageThemes } from "../types/types.js";
import { BadRequestError, ServerError, ConflictError, AuthorizationError, ValidationError, ResourceNotFoundError } from "../errors/errorClasses.js";
import { sendMessage, producer } from "../service/kafka.service.js";
import { getFromDb } from "../service/kafka.service.js";
import { db } from "../db.js";
export const updateSesCode = async (applicationId, sesCode) => {
    try {
        await db.none('UPDATE application SET ses_code = $1 WHERE application_id = $2;', [sesCode, applicationId]);
    }
    catch (error) {
        console.error('Error updating SES code:', error);
        throw error;
    }
};
function generateRandomNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}
export const sendSes = async (req, res) => {
    try {
        const applicationId = req.params.applicationId;
        const application = await getFromDb('application', applicationId);
        const clientId = JSON.parse(application.client_id);
        const client = await getFromDb('client', clientId);
        const sesCode = generateRandomNumber().toString();
        await updateSesCode(applicationId, sesCode);
        const application2 = await getFromDb('application', applicationId);
        console.log('appl 2 ', application2);
        await producer.connect();
        const message = {
            address: client.email,
            theme: MessageThemes.SendSes,
            applicationId: applicationId,
            name: client.first_name,
            lastName: client.last_name,
            sesCode: sesCode,
        };
        sendMessage('send-ses', message);
        res.send('Send ses');
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
//# sourceMappingURL=sendSes.controller.js.map