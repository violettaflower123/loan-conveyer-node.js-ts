"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = require("./helpers/logger");
const utils_1 = require("./helpers/utils");
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use((req, res, next) => {
    logger_1.logger.info(`Received ${req.method} request for ${req.url}`);
    next();
});
app.use(body_parser_1.default.json());
app.use(utils_1.errorHandler);
const port = 3005;
app.listen((port), () => {
    logger_1.logger.info(`API Gateaway is running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map