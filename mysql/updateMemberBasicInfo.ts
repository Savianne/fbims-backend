import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

interface IBasicData {
    gender: string,
    date_of_birth: string,
    marital_status: string,
    first_name: string,
    middle_name: string,
    surname: string,
    ext_name: null | string,
}

async function updateMemberBasicInfo(memberUID: string, updateData: IBasicData): Promise<{ querySuccess: boolean }> {
    const promisePool = pool.promise();

    return new Promise<IQueryPromise>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                //get the FKeys
                const getFKey = ((await connection.query(`
                SELECT mpi.full_name, mpi.id AS personal_info_id
                FROM members AS m 
                    JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
                WHERE m.member_uid = ?
                `, [memberUID]) as RowDataPacket[][])[0])[0]
                
                //Update full Name
                await connection.query(`
                UPDATE full_name SET first_name = ?, middle_name = ?, surname = ?, ext_name = ?
                WHERE id = ?
                `, [updateData.first_name || null, updateData.middle_name || null, updateData.surname || null, updateData.ext_name, getFKey.full_name]);

                await connection.query(`
                UPDATE members_personal_info SET gender = ?, marital_status = ?, date_of_birth = ?
                WHERE id = ?
                `, [updateData.gender || null, updateData.marital_status || null, updateData.date_of_birth || null, getFKey.personal_info_id]);

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

export default updateMemberBasicInfo;
