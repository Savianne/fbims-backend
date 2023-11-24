import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

interface IUpdateOrganizationInfo {
    organizationName: string,
    description: string,
}

async function updateOrganizationInfo(organizationUID: string, updateData: IUpdateOrganizationInfo): Promise<{ querySuccess: boolean }> {
    const promisePool = pool.promise();
    return new Promise<IQueryPromise>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                //Get FKey
                const organizationInfoKey = ((await connection.query(`
                SELECT organization_info from organizations WHERE organization_uid = ?
                `, [organizationUID]) as RowDataPacket[][])[0])[0].organization_info;
                
                //Update Ministry info
                await connection.query('UPDATE organization_info SET organization_name = ?, description = ? WHERE id = ?', [updateData.organizationName || null, updateData.description || null, organizationInfoKey])

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

export default updateOrganizationInfo;
