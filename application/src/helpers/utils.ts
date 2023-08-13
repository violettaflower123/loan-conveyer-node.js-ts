import { ErrorRequestHandler } from "express";
import { logger } from "./logger.js";
import { BadRequestError, ConflictError, ServerError, AuthorizationError, ValidationError } from "../errors/errorClasses.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    logger.error(`Error occurred: ${err.message}`);
  
    if (err instanceof BadRequestError) {
      res.status(400).json({ error: err.message });
    } else if (err instanceof ValidationError ) {
      res.status(err.statusCode).json({ error: err.message });
    } else if (err instanceof ConflictError) {
      res.status(err.statusCode).json({ error: err.message });
    } else if (err instanceof AuthorizationError) {
      res.status(err.statusCode).json({ error: err.message });
    } else if (err instanceof ServerError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  };