import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

interface IUpdateContactInfo {
    label: "personal" | "home",
    email: string | null,
    cpNumber: string | null,
    telephoneNumber: string | null
}

async function updateContactInfo(memberUID: string, updateData: IUpdateContactInfo): Promise<{ querySuccess: boolean }> {
    const promisePool = pool.promise();
    console.log(updateData)
    return new Promise<IQueryPromise>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                //get the FKeys
                const getFKey = ((await connection.query(`SELECT contact_info, home_contact_info FROM members WHERE member_uid = ?`, [memberUID]) as RowDataPacket[][])[0])[0];
                console.log(getFKey)
                updateData.label == "personal" && getFKey.contact_info && await connection.query(`
                UPDATE members_contact_info SET email = ?, cp_number = ?, tel_number = ? WHERE id = ?                
                `, [updateData.email, updateData.cpNumber, updateData.telephoneNumber, getFKey.contact_info]);

                updateData.label == "home" && getFKey.home_contact_info && await connection.query(`
                UPDATE members_home_contact_info SET email = ?, cp_number = ?, tel_number = ? WHERE id = ?                
                `, [updateData.email, updateData.cpNumber, updateData.telephoneNumber, getFKey.home_contact_info]);

                const newPersonalContactInfoId = updateData.label == "personal" && getFKey.contact_info == null? 
                    (await connection.query(`INSERT INTO members_contact_info (email, cp_number, tel_number) VALUES(?, ?, ?)`, [updateData.email, updateData.cpNumber, updateData.telephoneNumber])as OkPacket[])[0].insertId
                    : null;
                
                const newHomeContactInfoId = updateData.label == "home" && getFKey.home_contact_info == null? 
                    (await connection.query(`INSERT INTO members_home_contact_info (email, cp_number, tel_number) VALUES(?, ?, ?)`, [updateData.email, updateData.cpNumber, updateData.telephoneNumber])as OkPacket[])[0].insertId
                    : null;

                updateData.label == "personal" && getFKey.contact_info == null && newPersonalContactInfoId && await connection.query(`UPDATE members SET contact_info = ? WHERE member_uid = ?`, [newPersonalContactInfoId, memberUID]);

                updateData.label == "home" && getFKey.home_contact_info == null && newHomeContactInfoId && await connection.query(`UPDATE members SET home_contact_info = ? WHERE member_uid = ?`, [newHomeContactInfoId, memberUID])

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

export default updateContactInfo;
