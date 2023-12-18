import pool from "./pool";
import { generateUID } from "../controller/generateUID";

type TEntryData = {
    description: string;
    entryDate: string;
    categoryUID: string;
}

async function addAttendanceEntry(entryData: TEntryData): Promise<{ querySuccess: boolean, error?: any, entryUID: string }> {
    const promisePool = pool.promise();

    return new Promise<{ querySuccess: boolean, error?: any, entryUID: string}>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                const entryUID = generateUID();

                await connection.query(`INSERT INTO attendance_entries (entry_uid, description, date, category_uid) VALUES(?, ?, ?, ?)`,[entryUID, entryData.description, entryData.entryDate, entryData.categoryUID]);
                await connection.query(`INSERT INTO pending_attendance_entries (entry_uid) VALUES(?)`, [entryUID]);
                await connection.query(`INSERT INTO entry_session (entry_uid) VALUES(?)`, [entryUID]);

                //Commit 
                connection.commit();
                connection.release();
                resolve({querySuccess: true, entryUID: entryUID});
            })
            .catch((beginTransactionError) => {
                connection.rollback();
                connection.release();
                reject({
                    querySuccess: false,
                    error: beginTransactionError,
                });
            });
        })
        .catch((getConnectionError) => {
            reject({
                querySuccess: false,
                error: getConnectionError,
            });
        })
    })
}


export default addAttendanceEntry;