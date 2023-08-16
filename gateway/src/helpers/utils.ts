import { logger } from "./logger.js";
import { Request, Response, NextFunction } from "express";
import { ErrorRequestHandler } from "express";
import { BadRequestError, ConflictError, ResourceNotFoundError, AuthorizationError, ValidationError, ServerError } from "../errors/errorClasses.js";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;  
  const errorData = err.response?.data || err.message || 'Unknown error';
  if (err.statusCode) {
      statusCode = err.statusCode; 
  }
  res.status(statusCode).json({ error: errorData });
  logger.error(errorData);
}
