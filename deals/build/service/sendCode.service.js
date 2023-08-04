import { db } from "../db.js";
export const getStatusId = async (statusValue) => {
    try {
        const status = await db.one('SELECT id FROM credit_status WHERE credit_status = $1;', [statusValue]);
        return status.id;
    }
    catch (error) {
        console.error('Error getting status ID:', error);
        throw error;
    }
};
export const updateCreditStatus = async (creditId, creditStatusId) => {
    try {
        await db.none('UPDATE credit SET credit_status_id = $1 WHERE credit_id = $2;', [creditStatusId, creditId]);
    }
    catch (error) {
        console.error('Error updating credit status:', error);
        throw error;
    }
};
export const updateApplication = async (applicationId, newStatus, sesCode) => {
    try {
        const now = new Date();
        const newStatusHistoryItem = {
            time: now,
            status: newStatus,
            changeType: 'AUTOMATIC'
        };
        const result = await db.one('SELECT status_history FROM application WHERE application_id = $1', [applicationId]);
        let statusHistory = result.status_history;
        // Добавить новый элемент и отсортировать по времени
        statusHistory.push(newStatusHistoryItem);
        statusHistory.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
        await db.none(`
        UPDATE application 
        SET status = $1, sign_date = $2, ses_code = $3, status_history = $4::jsonb 
        WHERE application_id = $5;
        `, [newStatus, now, sesCode, JSON.stringify(statusHistory), applicationId]);
    }
    catch (error) {
        console.error('Error updating application:', error);
        throw error;
    }
};
//# sourceMappingURL=sendCode.service.js.map