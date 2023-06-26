import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

async function addMemberToMinistry(minstryUID: string, memberUID: string): Promise<{ success: boolean, error?: any, data?: any }> {
    const promisePool = pool.promise();

    return new Promise<{ success: boolean, error?: any, data?: any }>(async (resolve, reject) => {
        try {
            const isExist = ((((await promisePool.query("SELECT COUNT(*) AS count FROM ministry_members WHERE ministry_uid = ? AND member_uid = ?", [minstryUID, memberUID])) as OkPacket[][])[0][0]) as unknown as {count: number}).count
           
            if(isExist) return reject({ success: false, error: "Duplicate Entry"});

            const addMemberToMinistryQuery = `INSERT INTO ministry_members (ministry_uid, member_uid) VALUES (?, ?)`; 

            const isAdded = (await promisePool.query(addMemberToMinistryQuery, [minstryUID, memberUID]) as OkPacket[])[0].affectedRows;

            isAdded? resolve({success: true}) : reject({success: false, error: "Faild to Add"})
        }
        catch(err) {
            console.log(err);
            reject({success: false, error: "Internal Server Error"})
        }
    })
}


export default addMemberToMinistry;