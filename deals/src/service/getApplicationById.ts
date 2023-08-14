import { db } from "../db.js";
import { ApplicationDTO } from "../dtos.js";
import { logger } from "../helpers/logger.js";

export const getOneApplication = async (applicationId: string): Promise<ApplicationDTO> => {
    try {
        return await db.one('SELECT * FROM application WHERE application_id = $1', [applicationId]);  
    } catch(err) {
        logger.error(`Error occurred in GetApplications: ${err}`);
        throw err;
    }
}