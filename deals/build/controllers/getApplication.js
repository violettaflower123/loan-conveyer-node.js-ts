import { logger } from "../helpers/logger.js";
import { getAllApplications } from "../service/getApplication.js";
export const getApplication = async (req, res, next) => {
    try {
        const data = await getAllApplications();
        res.send(data);
    }
    catch (err) {
        logger.error(`Error occurred during request to ${req.path}: ${err.message}`, { error: err, body: req.body, query: req.query });
        next(err);
    }
};
//# sourceMappingURL=getApplication.js.map