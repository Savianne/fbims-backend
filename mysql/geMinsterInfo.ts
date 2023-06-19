import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

async function getMinistryInfo(minstryUID: string): Promise<{ success: boolean, error?: any, data?: any }> {
    const promisePool = pool.promise();

    return new Promise<{ success: boolean, error?: any, data?: any }>((resolve, reject) => {
        const getMinistryQuery = `
        SELECT m.ministry_uid AS ministryUID, mi.ministry_name AS ministryName, mi.description, a.avatar
        FROM ministry AS m
        JOIN ministry_info AS mi ON m.ministry_info = mi.id
        LEFT JOIN avatar AS a ON m.avatar = a.id
        WHERE m.ministry_uid = ?`;

        promisePool.query(getMinistryQuery, [minstryUID])
        .then(result => {
            const data = (result as RowDataPacket[][])[0];
    
            resolve({success: true, data: data[0]})
        })
        .catch(err => {
            console.log(err)
            reject({success: false, error: err})
        })
    })
}


export default getMinistryInfo;