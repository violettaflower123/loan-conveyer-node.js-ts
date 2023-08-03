import { ResourceNotFoundError, BadRequestError, ConflictError, ServerError, AuthorizationError, ValidationError } from "../errors/errorClasses.js";
import { db } from "../db.js";
export async function getFromDb(table, id) {
    const query = `SELECT * FROM ${table} WHERE ${table}_id = $1`;
    const result = await db.one(query, [id]);
    return result;
}
export const sendDocuments = async (req, res) => {
    try {
        const applicationId = req.params.applicationId;
        const application = await getFromDb('application', applicationId);
        const creditId = application.credit_id;
        const clientId = JSON.parse(application.client_id);
        const client = await getFromDb('client', clientId);
        // console.log(client);
        const credit = await getFromDb('credit', creditId);
        // console.log(credit);
        console.log('id', application.applied_offer, credit.payment_schedule, clientId);
        if (!application) {
            throw new ResourceNotFoundError('Application not found.');
        }
        res.send('Hey');
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
            // If the error is not of any expected type, return a general server error
            res.status(500).send({
                message: 'An unexpected error occurred.',
                error: error.message
            });
        }
    }
};
//# sourceMappingURL=sendDocuments.controller.js.map