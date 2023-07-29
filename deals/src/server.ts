import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import pgPromise from 'pg-promise';
import { dealRouter  } from './routes/deal.js';
import { ValidationError, ServerError, BadRequestError } from './errors/errorClasses.js';

const app = express();
app.use(bodyParser.json());

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof BadRequestError) {
      res.status(400).json({ error: err.message });
    } else if (err instanceof ValidationError || err instanceof ServerError) {
      res.status(err.statusCode).json({ error: err.message });
    } else if (err.message === 'Клиент с данным паспортом уже существует') {
      res.status(409).json({ error: 'Клиент с данным паспортом уже существует' });
    } else if (err.message === 'Не удалось получить предложения о кредите') {
      res.status(500).json({ error: 'Не удалось получить предложения о кредите с API Conveyor.' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
};

app.use('/deal', dealRouter);
app.use(errorHandler);


const port: number = 3002;
app.listen((port), () => {
    console.log(`Server is running on http://localhost:${port}`)
})
