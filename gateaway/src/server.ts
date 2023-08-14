import express, { NextFunction, Request, Response } from 'express';
import { logger } from './helpers/logger';
import { errorHandler } from './helpers/utils';
import bodyParser from 'body-parser';


const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Received ${req.method} request for ${req.url}`);
  next();
});

app.use(bodyParser.json());


app.use(errorHandler);

const port: number = 3005;
app.listen((port), () => {
  logger.info(`API Gateaway is running on http://localhost:${port}`);
})
