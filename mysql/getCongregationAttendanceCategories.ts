import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";

type TCategoryData = {
    title: string;
    type: "basic" | "detailed";
    attender: "all" | "select";
    uid: string
}

async function getCongregationAttendanceCategories(congregation: string): Promise<{ querySuccess: boolean, error?: any, data: TCategoryData[] }> {
    const promisePool = pool.promise();

    return new Promise<{ querySuccess: boolean, error?: any, data: TCategoryData[]}>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                //Get congregation categories
                const categories = ((await connection.query(`
                SELECT ac.uid, ac.title, ac.type, ac.attender
                FROM congregation_attendance_category AS cac
                JOIN attendance_categories AS ac ON cac.category_uid = ac.uid and cac.congregation_uid = ?
                `, [congregation]) as RowDataPacket[][])[0]);

                //Commit 
                connection.commit();
                connection.release();
                resolve({querySuccess: true, data: categories as TCategoryData[]});
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


export default getCongregationAttendanceCategories;