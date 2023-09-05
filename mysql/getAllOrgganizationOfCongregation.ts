import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

async function getAllOrganizationOfCongregation(congregation: string): Promise<{ success: boolean, error?: any, data?: any }> {
    const promisePool = pool.promise();

    return new Promise<{ success: boolean, error?: any, data?: any }>((resolve, reject) => {
        const getAllOrganizationOfCongregationQuery = `
        SELECT co.organization_uid AS organizationUID, a.avatar, oi.description, oi.organization_name AS organizationName
        FROM congregation_organizations AS co
        JOIN organizations AS o ON co.organization_uid = o.organization_uid
        JOIN organization_info AS oi ON o.organization_info = oi.id
        LEFT JOIN avatar AS a ON o.avatar = a.id
        WHERE co.congregation_uid = ?`;

        promisePool.query(getAllOrganizationOfCongregationQuery, [congregation])
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


export default getAllOrganizationOfCongregation;