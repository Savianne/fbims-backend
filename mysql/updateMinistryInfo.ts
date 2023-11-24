import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

interface IUpdateMinistryInfo {
    ministryName: string,
    description: string,
}

async function updateMinistryInfo(ministryUID: string, updateData: IUpdateMinistryInfo): Promise<{ querySuccess: boolean }> {
    const promisePool = pool.promise();
    return new Promise<IQueryPromise>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                //Get FKey
                const ministryInfoKey = ((await connection.query(`
                SELECT ministry_info from ministry WHERE ministry_uid = ?
                `, [ministryUID]) as RowDataPacket[][])[0])[0].ministry_info;
                
                //Update Ministry info
                await connection.query('UPDATE ministry_info SET ministry_name = ?, description = ? WHERE id = ?', [updateData.ministryName || null, updateData.description || null, ministryInfoKey])

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

export default updateMinistryInfo;
