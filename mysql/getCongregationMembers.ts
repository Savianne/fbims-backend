import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

async function getCongregationMembers(
    congregation: string,
    payload: {
        sorting: "A-Z" | "Z-A",  
        page: number,
        limit: number
    }) 
{
    const promisePool = pool.promise();
    return new Promise<{ querySuccess: boolean, result: any }>((resolve, reject) => {
        const query = `
            SELECT fn.first_name, fn.middle_name,  fn.surname, fn.ext_name, m.member_uid, aa.account_name AS added_by, cm.created_time AS creation_time, a.avatar
            FROM congregation_members AS cm
                JOIN members AS m ON cm.member_uid = m.member_uid
                JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
                JOIN full_name AS fn ON mpi.full_name = fn.id
                LEFT JOIN avatar AS a ON m.avatar = a.id
                LEFT JOIN admin_account AS aa ON aa.account_uid = cm.created_by
            WHERE cm.congregation_uid = ? 
            ORDER BY fn.first_name ${payload.sorting == "A-Z"? "ASC" : "DESC"}
            LIMIT ?, ?
        `;
        promisePool.query(query, [congregation, ((payload.limit * payload.page) - payload.limit), payload.limit])
        .then(res => {
            const list = (res as RowDataPacket[][])[0];
            resolve({ querySuccess: true, result: list})
        })
        .catch(err => {
            console.log(err)
            reject({ querySuccess: false, error: err})
        });
    })
};

export default getCongregationMembers;