import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

async function getOrganizationInfo(orgUID: string): Promise<{ success: boolean, error?: any, data?: any }> {
    const promisePool = pool.promise();

    return new Promise<{ success: boolean, error?: any, data?: any }>((resolve, reject) => {
        const getOrgQuery = `
        SELECT o.organization_uid AS organizationUID, oi.organization_name  AS organizationName, oi.description, a.avatar
        FROM organizations AS o
        JOIN organization_info AS oi ON o.organization_info = oi.id
        LEFT JOIN avatar AS a ON o.avatar = a.id
        WHERE o.organization_uid = ?`;

        promisePool.query(getOrgQuery, [orgUID])
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


export default getOrganizationInfo;