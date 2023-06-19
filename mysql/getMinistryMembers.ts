import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

async function getMinistryMembers(ministryUID: string): Promise<{ success: boolean, error?: any, data?: any }> {
    const promisePool = pool.promise();

    return new Promise<{ success: boolean, error?: any, data?: any }>((resolve, reject) => {
        const getAllMembersOfTheMinistryQuery = `
        SELECT m.member_uid AS memberUID, fn.first_name AS firstName, fn.middle_name AS middleName, fn.surname, a.avatar
        FROM ministry_members AS mm
        JOIN members AS m ON mm.member_uid = m.member_uid
        JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
        JOIN full_name AS fn ON mpi.full_name = fn.id
        LEFT JOIN avatar AS a ON m.avatar = a.id
        WHERE mm.ministry_uid = ?
        `;

        promisePool.query(getAllMembersOfTheMinistryQuery, [ministryUID])
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


export default getMinistryMembers;