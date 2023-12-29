import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";

type TEntries = ({
    attender: "select" | "all",
    categoryTitle: string,
    categoryUID: string,
    date: string,
    description: string,
    entryUID: string,
    type: "basic" | "detailed",
    pending: boolean,
    saved: boolean
})[];

type TResult = {
    total: number,
    entries: TEntries
}

async function getAttendanceEntriesByCategory(congregationUID: string, categoryUID: string, lastSelectedIndex: number, dateRangeFilter: {from: string, to: string} | null): Promise<{ querySuccess: boolean, error?: any, data: TResult }> {
    const promisePool = pool.promise();

    return new Promise<{ querySuccess: boolean, error?: any, data: TResult}>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                //get total row
                const totalRow = dateRangeFilter? 
                ((await connection.query(`
                    SELECT COUNT(ae.id) as total
                    FROM attendance_entries AS ae
                    JOIN attendance_categories AS ac ON ae.category_uid = ac.uid
                    LEFT JOIN pending_attendance_entries AS pae ON ae.entry_uid = pae.entry_uid
                    LEFT JOIN submitted_attendance_entries AS sae ON ae.entry_uid = sae.entry_uid
                    JOIN congregation_attendance_category AS cac ON ac.uid = cac.category_uid
                    WHERE cac.congregation_uid = ? AND ac.uid = ? AND ae.date >= ? AND ae.date <= ?
                `, [congregationUID, categoryUID, dateRangeFilter.from, dateRangeFilter.to])) as RowDataPacket[])[0][0].total :
                ((await connection.query(`
                    SELECT COUNT(ae.id) as total
                    FROM attendance_entries AS ae
                    JOIN attendance_categories AS ac ON ae.category_uid = ac.uid
                    LEFT JOIN pending_attendance_entries AS pae ON ae.entry_uid = pae.entry_uid
                    LEFT JOIN submitted_attendance_entries AS sae ON ae.entry_uid = sae.entry_uid
                    JOIN congregation_attendance_category AS cac ON ac.uid = cac.category_uid
                    WHERE cac.congregation_uid = ? AND ac.uid = ?
                `, [congregationUID, categoryUID])) as RowDataPacket[])[0][0].total

                const result = dateRangeFilter? (((await connection.query(`
                    SELECT 
                        CASE 
                            WHEN pae.entry_uid IS NOT NULL THEN true
                            ELSE false
                        END as pending,
                        CASE 
                            WHEN sae.entry_uid IS NOT NULL THEN true
                            ELSE false
                        END as saved,
                        ae.entry_uid AS entryUID, 
                        ac.uid AS categoryUID, 
                        ac.title AS categoryTitle, 
                        ac.type, 
                        ac.attender, 
                        ae.description, 
                        ae.date
                    FROM attendance_entries AS ae
                    JOIN attendance_categories AS ac ON ae.category_uid = ac.uid
                    LEFT JOIN pending_attendance_entries AS pae ON ae.entry_uid = pae.entry_uid
                    LEFT JOIN submitted_attendance_entries AS sae ON ae.entry_uid = sae.entry_uid
                    JOIN congregation_attendance_category AS cac ON ac.uid = cac.category_uid
                    WHERE cac.congregation_uid = ? AND ac.uid = ? AND ae.date >= ? AND ae.date <= ?
                    LIMIT ?, ?
                `, [congregationUID, categoryUID, dateRangeFilter.from, dateRangeFilter.to, +lastSelectedIndex || 0, 10])) as RowDataPacket[])[0]) as TEntries :
                (((await connection.query(`
                    SELECT 
                        CASE 
                            WHEN pae.entry_uid IS NOT NULL THEN true
                            ELSE false
                        END as pending,
                        CASE 
                            WHEN sae.entry_uid IS NOT NULL THEN true
                            ELSE false
                        END as saved,
                        ae.entry_uid AS entryUID, 
                        ac.uid AS categoryUID, 
                        ac.title AS categoryTitle, 
                        ac.type, 
                        ac.attender, 
                        ae.description, 
                        ae.date
                    FROM attendance_entries AS ae
                    JOIN attendance_categories AS ac ON ae.category_uid = ac.uid
                    LEFT JOIN pending_attendance_entries AS pae ON ae.entry_uid = pae.entry_uid
                    LEFT JOIN submitted_attendance_entries AS sae ON ae.entry_uid = sae.entry_uid
                    JOIN congregation_attendance_category AS cac ON ac.uid = cac.category_uid
                    WHERE cac.congregation_uid = ? AND ac.uid = ?
                    LIMIT ?, ?
                `, [congregationUID, categoryUID, +lastSelectedIndex || 0, 10])) as RowDataPacket[])[0]) as TEntries

                //Commit 
                connection.commit();
                connection.release();
                resolve({querySuccess: true, data: {
                    total: totalRow,
                    entries: result
                }});
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


export default getAttendanceEntriesByCategory;