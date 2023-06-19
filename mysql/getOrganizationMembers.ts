import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

async function getOrganizationMembers(organizationUID: string): Promise<{ success: boolean, error?: any, data?: any }> {
    const promisePool = pool.promise();

    return new Promise<{ success: boolean, error?: any, data?: any }>((resolve, reject) => {
        const getAllMembersOfTheOrganizationQuery = `
        SELECT om.member_uid AS memberUID, fn.first_name AS firstName, fn.middle_name AS middleName, fn.surname, a.avatar
        FROM organization_members AS om
        JOIN organizations AS o ON om.organization_uid = o.organization_uid
        JOIN members AS m ON m.member_uid = om.member_uid
        JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
        JOIN full_name AS fn ON mpi.full_name = fn.id
        LEFT JOIN avatar AS a ON m.avatar = a.id
        WHERE om.organization_uid = ?
        `;

        promisePool.query(getAllMembersOfTheOrganizationQuery, [organizationUID])
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


export default getOrganizationMembers;