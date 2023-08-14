import { db } from "../db.js";
import { ApplicationDTO } from "../dtos.js";
import { logger } from "../helpers/logger.js";

export const getAllApplications = async (): Promise<ApplicationDTO[]> => {
    try {
        return db.manyOrNone('SELECT * FROM application');
    } catch (err: any) {
        logger.error(`Error occurred in GetApplications: ${err}`);
        throw err;
    }
}