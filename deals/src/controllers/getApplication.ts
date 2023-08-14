import { Request, Response, NextFunction } from "express";
import { logger } from "../helpers/logger.js";
import { getAllApplications } from "../service/getApplication.js";

export const getApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getAllApplications();  
      res.send(data);
    } catch (err: any) {
        logger.error(`Error occurred during request to ${req.path}: ${err.message}`, { error: err, body: req.body, query: req.query });
        next(err);
    }
}