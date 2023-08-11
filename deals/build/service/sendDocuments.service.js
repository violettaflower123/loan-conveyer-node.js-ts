import { db } from "../db.js";
import { logger } from "../helpers/logger.js";
export const updateApplication = async (applicationId, newStatus) => {
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
        statusHistory.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
        await db.none(`
        UPDATE application 
        SET status = $1, sign_date = $2, status_history = $3::jsonb 
        WHERE application_id = $4;
        `, [newStatus, now, JSON.stringify(statusHistory), applicationId]);
    }
    catch (error) {
        logger.error('Error updating application:', error);
        throw error;
    }
};
//# sourceMappingURL=sendDocuments.service.js.map