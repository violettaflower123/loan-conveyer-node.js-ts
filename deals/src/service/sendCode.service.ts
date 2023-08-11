import { db } from "../db.js";
import { logger } from "../helpers/logger.js";

export const getStatusId = async (statusValue: string): Promise<string> => {
    try {
        const status = await db.one('SELECT id FROM credit_status WHERE credit_status = $1;', [statusValue]);
        return status.id;
    } catch (error) {
        logger.error('Error getting status ID:', error);
        throw error;
    }
}

export const updateCreditStatus = async (creditId: string, creditStatusId: string): Promise<void> => {
    try {
        await db.none('UPDATE credit SET credit_status_id = $1 WHERE credit_id = $2;', [creditStatusId, creditId]);
    } catch (error) {
        logger.error('Error updating credit status:', error);
        throw error;
    }
}

export const updateApplication = async (applicationId: string, newStatus: string, sesCode: string): Promise<void> => {
    try {
        const now = new Date();
        const newStatusHistoryItem = {
            time: now,
            status: newStatus,
            changeType: 'AUTOMATIC'
        };

        const result = await db.one('SELECT status_history FROM application WHERE application_id = $1', [applicationId]);
        let statusHistory = result.status_history;

        statusHistory.push(newStatusHistoryItem);
        statusHistory.sort((a: { time: string }, b: { time: string }) => new Date(a.time).getTime() - new Date(b.time).getTime());

        await db.none(`
        UPDATE application 
        SET status = $1, sign_date = $2, ses_code = $3, status_history = $4::jsonb 
        WHERE application_id = $5;
        `, [newStatus, now, sesCode, JSON.stringify(statusHistory), applicationId]);
    } catch (error) {
        logger.error('Error updating application:', error);
        throw error;
    }
}