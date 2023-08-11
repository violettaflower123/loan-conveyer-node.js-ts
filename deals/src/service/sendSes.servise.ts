import { db } from "../db.js";
import { logger } from "../helpers/logger.js";

export const updateSesCode = async (applicationId: string, sesCode: string): Promise<void> => {
    try {
      await db.none('UPDATE application SET ses_code = $1 WHERE application_id = $2;', [sesCode, applicationId]);
    } catch (error) {
      logger.error('Error updating SES code:', error);
      throw error;
    }
}

export function generateRandomNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}