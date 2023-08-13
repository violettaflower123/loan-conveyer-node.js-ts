import express from 'express';
import bodyParser from 'body-parser';
import { applicationRouter } from './routes/application.js';
import { logger } from './helpers/logger.js';
import { errorHandler } from './helpers/utils.js';
const app = express();
app.use((req, res, next) => {
    logger.info(`Received ${req.method} request for ${req.url}`);
    next();
});
app.use(bodyParser.json());
app.use('/application', applicationRouter);
app.use(errorHandler);
const port = 3003;
app.listen((port), () => {
    logger.info(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map