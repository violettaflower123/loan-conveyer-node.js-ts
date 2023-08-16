"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_js_1 = require("./logger.js");
const errorHandler = (err, req, res, next) => {
    var _a;
    let statusCode = 500;
    const errorData = ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message || 'Unknown error';
    if (err.statusCode) {
        statusCode = err.statusCode;
    }
    res.status(statusCode).json({ error: errorData });
    logger_js_1.logger.error(errorData);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=utils.js.map