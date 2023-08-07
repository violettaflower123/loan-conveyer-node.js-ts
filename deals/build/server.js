import express from 'express';
import bodyParser from 'body-parser';
import { dealRouter } from './routes/deal.js';
import { ValidationError, ServerError, BadRequestError, ResourceNotFoundError, AuthorizationError, ConflictError } from './errors/errorClasses.js';
import { logger } from './helpers/logger.js';
const app = express();
app.use((req, res, next) => {
    logger.info(`Received ${req.method} request for ${req.url}`);
    next();
});
app.use(bodyParser.json());
// const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
//   logger.error(`Error occurred: ${err.message}`);
//     if (err instanceof BadRequestError) {
//       res.status(400).json({ error: err.message });
//     } else if (err instanceof ValidationError || err instanceof ServerError) {
//       res.status(err.statusCode).json({ error: err.message });
//     } else if (err.message === 'Клиент с данным паспортом уже существует') {
//       res.status(409).json({ error: 'Клиент с данным паспортом уже существует' });
//     } else if (err.message === 'Не удалось получить предложения о кредите') {
//       res.status(500).json({ error: 'Не удалось получить предложения о кредите с API Conveyor.' });
//     } else {
//       res.status(500).json({ error: 'Internal server error' });
//     }
// };
const errorHandler = (err, req, res, next) => {
    logger.error(`Error occurred: ${err.message}`);
    if (err.response && err.response.status === 400) {
        return res.status(400).json({ error: err.response.data.error || 'Bad Request' });
    }
    if (err instanceof BadRequestError) {
        return res.status(400).json({ error: err.message });
    }
    if (err instanceof ConflictError) {
        return res.status(409).json({ error: err.message });
    }
    if (err instanceof ResourceNotFoundError) {
        return res.status(404).json({ error: err.message });
    }
    if (err instanceof AuthorizationError) {
        return res.status(401).json({ error: err.message });
    }
    if (err instanceof ValidationError) {
        return res.status(403).json({ error: err.message });
    }
    if (err instanceof ServerError) {
        return res.status(500).json({ error: err.message });
    }
    if (err.message === 'Клиент с данным паспортом уже существует') {
        return res.status(409).json({ error: 'Клиент с данным паспортом уже существует' });
    }
    if (err.message === 'Не удалось получить предложения о кредите') {
        return res.status(500).json({ error: 'Не удалось получить предложения о кредите с API Conveyor.' });
    }
    return res.status(500).json({ error: 'Internal server error' });
};
app.use('/deal', dealRouter);
app.use(errorHandler);
const port = 3002;
app.listen((port), () => {
    logger.info(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map