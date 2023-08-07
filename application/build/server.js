import express from 'express';
import bodyParser from 'body-parser';
import { applicationRouter } from './routes/application.js';
import { ValidationError, ServerError, BadRequestError, ConflictError, AuthorizationError } from './errors/errorClasses.js';
import { logger } from './helpers/logger.js';
const app = express();
app.use((req, res, next) => {
    logger.info(`Received ${req.method} request for ${req.url}`);
    next();
});
app.use(bodyParser.json());
const errorHandler = (err, req, res, next) => {
    logger.error(`Error occurred: ${err.message}`);
    if (err instanceof BadRequestError) {
        res.status(400).json({ error: err.message });
    }
    else if (err instanceof ValidationError) {
        res.status(err.statusCode).json({ error: err.message });
    }
    else if (err instanceof ConflictError) {
        res.status(err.statusCode).json({ error: err.message });
    }
    else if (err instanceof AuthorizationError) {
        res.status(err.statusCode).json({ error: err.message });
    }
    else if (err instanceof ServerError) {
        res.status(err.statusCode).json({ error: err.message });
    }
    else {
        res.status(500).json({ error: 'Internal server error' });
    }
};
app.use('/application', applicationRouter);
app.use(errorHandler);
const port = 3003;
app.listen((port), () => {
    logger.info(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map