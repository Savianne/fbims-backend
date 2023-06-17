import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

async function getRecordsCount(table: string, congregation: string) {
    const promisePool = pool.promise();
    return new Promise<{ querySuccess: boolean, result: any }>((resolve, reject) => {
        switch(table) {
            case "members":
                promisePool.query("SELECT COUNT(*) AS total_count FROM congregation_members WHERE congregation_uid = ?", [congregation])
                .then(res => {
                    const count = (res as RowDataPacket[][])[0][0];
                    resolve({ querySuccess: true, result: count})
                })
                .catch(err => {
                    reject({ querySuccess: false, error: err})
                });
        }
    })
};

export default getRecordsCount;