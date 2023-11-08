import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";

type TCategoryAttenders = {
    name: string;
    picture: string | null;
    memberUID: string;
}

async function getAttendanceCategoryAttenders(categoryUID: string): Promise<{ querySuccess: boolean, error?: any, data: TCategoryAttenders[] }> {
    const promisePool = pool.promise();

    return new Promise<{ querySuccess: boolean, error?: any, data: TCategoryAttenders[]}>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                //get attenders
                const attenders = ((await connection.query(`
                SELECT m.member_uid AS memberUID, a.avatar AS picture, CONCAT_WS(' ', fn.first_name, fn.middle_name, fn.surname, fn.ext_name) AS name
                FROM attendance_category_attenders AS aca
                JOIN members AS m ON aca.member_uid = m.member_uid
                JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
                JOIN full_name AS fn ON mpi.full_name = fn.id
                LEFT JOIN avatar AS a ON m.avatar = a.id
                WHERE aca.category_id = ?
                `, [categoryUID]) as RowDataPacket[][])[0]);

                //Commit 
                connection.commit();
                connection.release();
                resolve({querySuccess: true, data: attenders as TCategoryAttenders[]});
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


export default getAttendanceCategoryAttenders;