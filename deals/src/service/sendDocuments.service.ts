import { db } from "../db.js";
import { logger } from "../helpers/logger.js";

export const updateApplication = async (applicationId: string, newStatus: string): Promise<void> => {
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
        SET status = $1, status_history = $2::jsonb 
        WHERE application_id = $3;
        `, [newStatus, JSON.stringify(statusHistory), applicationId]);
    } catch (error) {
        logger.error('Error updating application:', error);
        throw error;
    }
}