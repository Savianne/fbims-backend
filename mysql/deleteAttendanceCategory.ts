import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";

async function deleteAttendanceCategory(categoryUID: string): Promise<{ querySuccess: boolean, error?: any}> {
    const promisePool = pool.promise();

    return new Promise<{ querySuccess: boolean, error?: any}>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                //check if the category has entry
                //if true cancel delete by throwing error
                //else continue detetion
                const hasEntries = (await connection.query(`
                SELECT COUNT(*) AS totalEntries
                FROM attendance_entries AS ae
                WHERE ae.category_uid = ?`, [categoryUID]) as RowDataPacket[][])[0][0].totalEntries;

                if(hasEntries) throw "Cannot delete category that has entries";

                //Delete attendance category query
                connection.query(`DELETE FROM attendance_categories WHERE uid = ?`, [categoryUID]);

                //Delete category attenders query
                connection.query(`DELETE FROM attendance_category_attenders WHERE category_id = ?`, [categoryUID]);

                //Delete relation from congregation_attendance_category
                connection.query(`DELETE FROM congregation_attendance_category WHERE category_uid = ?`, [categoryUID]);

                //Commit 
                connection.commit();
                connection.release();
                resolve({querySuccess: true});
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


export default deleteAttendanceCategory;