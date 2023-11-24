import pool from "./pool";
import { RowDataPacket } from "mysql2";

async function getAttendanceCategoryByUid(categoryUID: string): Promise<{ success: boolean, error?: any, result: any }> {
    const promisePool = pool.promise();

    return new Promise<{ success: boolean, error?: any, result: any }>((resolve, reject) => {
        const getAttendanceCategoryByUidQuery = `
        SELECT *
        FROM attendance_categories
        WHERE uid = ?`;

        promisePool.query(getAttendanceCategoryByUidQuery, [categoryUID])
        .then(result => {
            const rdata = (result as RowDataPacket[][])[0][0];
            resolve({success: true, result: rdata})
        })
        .catch(err => {
            reject({success: false, error: err})
        })
    })
}


export default getAttendanceCategoryByUid;