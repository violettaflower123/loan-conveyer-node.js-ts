import { db } from "../db.js";
import { logger } from "../helpers/logger.js";
export const getAllApplications = async () => {
    try {
        return db.manyOrNone('SELECT * FROM application');
    }
    catch (err) {
        logger.error(`Error occurred in GetApplications: ${err}`);
        throw err;
    }
};
//# sourceMappingURL=getApplication.js.map