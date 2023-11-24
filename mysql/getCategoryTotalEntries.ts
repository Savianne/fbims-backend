import pool from "./pool";
import { RowDataPacket } from "mysql2";

async function getCategoryTotalEntries(categoryUID: string): Promise<{ success: boolean, error?: any, totalEntries?: number }> {
    const promisePool = pool.promise();

    return new Promise<{ success: boolean, error?: any, totalEntries?: number }>((resolve, reject) => {
        const getCategoryEntriesQuery = `
        SELECT COUNT(*) AS totalEntries
        FROM attendance_entries AS ae
        WHERE ae.category_uid = ?`;

        promisePool.query(getCategoryEntriesQuery, [categoryUID])
        .then(result => {
            const totalEntries = (result as RowDataPacket[][])[0][0].totalEntries;
            resolve({success: true, totalEntries: totalEntries})
        })
        .catch(err => {
            reject({success: false, error: err})
        })
    })
}


export default getCategoryTotalEntries;