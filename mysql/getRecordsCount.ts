import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

async function getRecordsCount(table: string, congregation: string) {
    const promisePool = pool.promise();
    return new Promise<{ success: boolean, data: any }>((resolve, reject) => {
        const query = table == "members"? "SELECT COUNT(*) AS total_count FROM congregation_members WHERE congregation_uid = ?":
                      table == "ministry"? "SELECT COUNT(*) AS total_count FROM congregation_ministry WHERE congregation_uid = ?":
                      table == "organizations"? "SELECT COUNT(*) AS total_count FROM congregation_organizations WHERE congregation_uid = ?" : null;


        if(query) {
            promisePool.query(query, [congregation])
            .then(res => {
                const count = (res as RowDataPacket[][])[0][0];
                resolve({ success: true, data: count})
            })
            .catch(err => {
                reject({ success: false, error: err})
            });
        }
        else {
            reject({ success: false, error: "No Query"})
        }
    })
};

export default getRecordsCount;