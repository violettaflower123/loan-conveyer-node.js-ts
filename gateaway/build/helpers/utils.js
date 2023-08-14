"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_js_1 = require("./logger.js");
const errorClasses_js_1 = require("../errors/errorClasses.js");
const errorHandler = (err, req, res, _) => {
    logger_js_1.logger.error(`Error occurred: ${err.message}`);
    if (err.response && err.response.status === 400) {
        return res.status(400).json({ error: err.response.data.error || 'Bad Request' });
    }
    if (err instanceof errorClasses_js_1.BadRequestError ||
        err instanceof errorClasses_js_1.ConflictError ||
        err instanceof errorClasses_js_1.ResourceNotFoundError ||
        err instanceof errorClasses_js_1.AuthorizationError ||
        err instanceof errorClasses_js_1.ValidationError ||
        err instanceof errorClasses_js_1.ServerError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=utils.js.map