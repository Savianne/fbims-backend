import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";

async function deleteAttendanceEntrySession(entryUID: string, attendanceType: "basic" | "detailed", session: number): Promise<{ querySuccess: boolean, error?: any}> {
    const promisePool = pool.promise();

    return new Promise<{ querySuccess: boolean, error?: any}>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                if(attendanceType !== "basic" && attendanceType !== "detailed") throw "Invalid type";
                
                //Check if the session has attender
                const hasAttendees = attendanceType == "basic"? (await connection.query("SELECT COUNT(*) AS count FROM basic_attendance WHERE entry_uid = ? AND entry_session = ?", [entryUID, session]) as RowDataPacket[][])[0][0].count :
                (await connection.query("SELECT COUNT(*) AS count FROM detailed_attendance WHERE entry_uid = ? AND entry_session = ?", [entryUID, session]) as RowDataPacket[][])[0][0].count;

                if(hasAttendees) throw "Has attendee";

                await connection.query("DELETE FROM entry_session WHERE id = ? AND entry_uid = ?", [session, entryUID]);

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


export default deleteAttendanceEntrySession;