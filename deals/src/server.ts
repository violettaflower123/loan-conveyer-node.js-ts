import express, { ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import { dealRouter  } from './routes/deal.js';
import { ValidationError, ServerError, BadRequestError, ResourceNotFoundError, AuthorizationError, ConflictError } from './errors/errorClasses.js';
import { logger } from './helpers/logger.js';

const app = express();

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request for ${req.url}`);
  next();
});

app.use(bodyParser.json());

const errorHandler: ErrorRequestHandler = (err, req, res, _) => {
  logger.error(`Error occurred: ${err.message}`);

  if (err.response && err.response.status === 400) {
    return res.status(400).json({ error: err.response.data.error || 'Bad Request' });
  }

  if (err instanceof BadRequestError || 
      err instanceof ConflictError ||
      err instanceof ResourceNotFoundError ||
      err instanceof AuthorizationError ||
      err instanceof ValidationError ||
      err instanceof ServerError) {
    return res.status(err.statusCode).json({ error: err.message }); 
  }

  return res.status(500).json({ error: 'Internal server error' });
};



app.use('/deal', dealRouter);
app.use(errorHandler);


const port: number = 3002;
app.listen((port), () => {
  logger.info(`Server is running on http://localhost:${port}`);
})
