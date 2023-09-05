import fs from "fs";
import path from "path";
import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

async function removeMinistryMember(memberUID: string, ministryUID: string): Promise<{ querySuccess: boolean }> {
    const promisePool = pool.promise();

    return new Promise<IQueryPromise>((resolve, reject) => {
        promisePool.query("DELETE FROM ministry_members WHERE member_uid = ? AND ministry_uid = ?", [memberUID, ministryUID])
        .then(result => {
            if((result as OkPacket[])[0].affectedRows > 0) {
                resolve({querySuccess: true})
            } else throw "No changes has made"
        })
        .catch(err => {
            console.log(err)
            reject({querySuccess: false, error: err})
        })
    })
}

export default removeMinistryMember;