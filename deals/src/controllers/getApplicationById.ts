import { Request, Response, NextFunction } from "express";
import { db } from "../db.js";
import { logger } from "../helpers/logger.js";
import { ApplicationDTO } from "../dtos.js";
import { getOneApplication } from "../service/getApplicationById.js";


export const getApplicationById = async (req: Request, res: Response, next: NextFunction) => {
    const { applicationId } = req.params;
    try {
        const data: ApplicationDTO = await getOneApplication(applicationId);
        res.send(data);
    } catch (err: any) {
        logger.error(`Error occurred during request to ${req.path}: ${err.message}`, { error: err, body: req.body, query: req.query });
        next(err);
    }

}