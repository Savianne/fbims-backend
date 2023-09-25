import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

async function searchMemberForMinistryMembership(ministryUID: string, congregation: string, searchTerm: string): Promise<{ success: boolean, error?: any, data?: any }> {
    const promisePool = pool.promise();

    return new Promise<{ success: boolean, error?: any, data?: any }>((resolve, reject) => {
        const searchMemberQuery = `
        SELECT m.member_uid AS memberUID, a.avatar, CONCAT_WS(' ', fn.first_name, fn.middle_name, fn.surname, fn.ext_name) AS name, mm.ministry_uid AS isMember
        FROM congregation_members AS cm
        JOIN members AS m ON cm.member_uid = m.member_uid AND cm.congregation_uid = ?
        LEFT JOIN ministry_members AS mm ON m.member_uid = mm.member_uid AND mm.ministry_uid = ?
        JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
        JOIN full_name AS fn ON mpi.full_name = fn.id
        LEFT JOIN avatar AS a ON m.avatar = a.id
        WHERE CONCAT_WS(' ', fn.first_name, fn.middle_name, fn.surname, fn.ext_name) LIKE ?`;

        promisePool.query(searchMemberQuery, [congregation, ministryUID, `%${searchTerm}%`])
        .then(result => {
            const data = (result as RowDataPacket[][]);
    
            resolve({success: true, data: data[0]})
        })
        .catch(err => {
            console.log(err)
            reject({success: false, error: err})
        })
    })
}


export default searchMemberForMinistryMembership;