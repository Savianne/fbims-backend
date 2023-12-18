import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";

type TEntry = {
    attender: "all" | "select",
    entryUID: string;
    memberUID: string;
    session: number;
    timeOut: string
}

async function addTimeOut(congregationUID: string, categoryUID: string, entry: TEntry): Promise<{ querySuccess: boolean, error?: any, profile: {memberUID: string, name: string, picture: string | null}}> {
    const promisePool = pool.promise();

    return new Promise<{ querySuccess: boolean, error?: any, profile: {memberUID: string, name: string, picture: string | null}}>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                //Check if member_uid is a belong to the congregation member_uid's
                const member_uid_exist = ((await connection.query("SELECT * FROM congregation_members WHERE congregation_uid  = ? AND member_uid = ?", [congregationUID, entry.memberUID])) as RowDataPacket[][])[0].length;

                if(member_uid_exist == 0) throw "Unkown ID";

                //Check if Entry still exist
                const entryStillExist = ((await connection.query("SELECT * FROM attendance_entries WHERE entry_uid = ?", [entry.entryUID])) as RowDataPacket[][])[0].length;

                if(entryStillExist == 0) throw "Entry does not exist";

                //check if session still exist
                const sessionExist = ((await connection.query("SELECT * FROM entry_session WHERE id = ? AND entry_uid = ?", [entry.session, entry.entryUID])) as RowDataPacket[][])[0].length;

                if(sessionExist == 0) throw "Session does not exist";

                //Check if member is attender of the entry
                const isAttender = entry.attender == "select" && 
                ((await connection.query("SELECT * FROM attendance_category_attenders WHERE member_uid = ? AND category_id = ?", [entry.memberUID, categoryUID])) as RowDataPacket[][])[0].length;
                   
                if(entry.attender == "select" && isAttender == 0) throw "Not belong as attender";

                //get pending time-out
                const pendingTimeOut = ((await connection.query("SELECT id FROM detailed_attendance WHERE entry_uid = ? AND member_uid = ? AND time_out IS NULL", [entry.entryUID, entry.memberUID])) as RowDataPacket[][])[0];
                
                if(pendingTimeOut.length == 0) throw "NO PENDING TIME-OUT";

                await connection.query("UPDATE detailed_attendance SET time_out = ? WHERE entry_uid = ? AND member_uid = ? AND id = ?", [entry.timeOut, entry.entryUID, entry.memberUID, pendingTimeOut[0].id]);

                //get profile
                const profile = ((await connection.query(`
                SELECT m.member_uid AS memberUID, a.avatar AS picture, CONCAT_WS(' ', fn.first_name, LEFT(fn.middle_name, 1), ". ", fn.surname, fn.ext_name) AS name
                FROM members AS m
                JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
                JOIN full_name AS fn ON mpi.full_name = fn.id
                LEFT JOIN avatar AS a ON m.avatar = a.id
                WHERE m.member_uid = ?
                LIMIT 1
                `, [entry.memberUID]) as RowDataPacket[][])[0][0]);

                //Commit 
                connection.commit();
                connection.release();
                resolve({querySuccess: true, profile: profile as {memberUID: string, name: string, picture: string | null}});
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


export default addTimeOut;