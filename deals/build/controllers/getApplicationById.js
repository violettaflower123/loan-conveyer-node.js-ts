import { logger } from "../helpers/logger.js";
import { getOneApplication } from "../service/getApplicationById.js";
export const getApplicationById = async (req, res, next) => {
    const { applicationId } = req.params;
    try {
        const data = await getOneApplication(applicationId);
        res.send(data);
    }
    catch (err) {
        logger.error(`Error occurred during request to ${req.path}: ${err.message}`, { error: err, body: req.body, query: req.query });
        next(err);
    }
};
//# sourceMappingURL=getApplicationById.js.map