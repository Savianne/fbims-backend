import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

async function getAllMinistryOfCongregation(congregation: string): Promise<{ success: boolean, error?: any, data?: any }> {
    const promisePool = pool.promise();

    return new Promise<{ success: boolean, error?: any, data?: any }>((resolve, reject) => {
        const getAllMinistryOfCongregationQuery = `
        SELECT cm.ministry_uid AS ministryUID, a.avatar, mi.description, mi.ministry_name AS ministryName
        FROM congregation_ministry AS cm
        JOIN ministry AS m ON cm.ministry_uid = m.ministry_uid
        JOIN ministry_info AS mi ON m.ministry_info = mi.id
        LEFT JOIN avatar AS a ON m.avatar = a.id
        WHERE cm.congregation_uid = ?`;

        promisePool.query(getAllMinistryOfCongregationQuery, [congregation])
        .then(result => {
            const data = (result as RowDataPacket[][])[0];
    
            resolve({success: true, data: data})
        })
        .catch(err => {
            console.log(err)
            reject({success: false, error: err})
        })
    })
}


export default getAllMinistryOfCongregation;