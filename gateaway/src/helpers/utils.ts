import { logger } from "./logger.js";
import { ErrorRequestHandler } from "express";
import { BadRequestError, ConflictError, ResourceNotFoundError, AuthorizationError, ValidationError, ServerError } from "../errors/errorClasses.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, _) => {
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