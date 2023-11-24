import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

interface IUpdateAddressData {
    address: {
        region: string,
        province: string,
        cityOrMunicipality: string,
        barangay: string
    } | string,
    addressType: 'local' | 'outside'
}

async function updatePermanentAddress(memberUID: string, updateData: IUpdateAddressData): Promise<{ querySuccess: boolean }> {
    const promisePool = pool.promise();
    return new Promise<IQueryPromise>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                //get the FKeys
                const getFKey = ((await connection.query(`
                SELECT mpi.id AS personal_info_id, mpi.permanent_address_ph, mpi.permanent_address_out_ph
                FROM members AS m 
                    JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
                WHERE m.member_uid = ?
                `, [memberUID]) as RowDataPacket[][])[0])[0];
                //Delete Address outside ph
                getFKey.permanent_address_out_ph && await connection.query("DELETE FROM outside_ph_address WHERE id = ?", [getFKey.permanent_address_out_ph])
                //DELETE Address PH
                getFKey.permanent_address_ph && await connection.query("DELETE FROM local_address_ph WHERE id = ?", [getFKey.permanent_address_ph]);
                //Insert new values
                const localAddress = updateData.addressType == "local" && typeof updateData.address !== "string"? (await connection.query("INSERT INTO local_address_ph (region, province, mun_city, barangay) VALUES(?, ?, ?, ?)", [updateData.address.region || null, updateData.address.province || null, updateData.address.cityOrMunicipality || null, updateData.address.barangay || null]) as OkPacket[])[0].insertId : null;
                const outsidePHAddress = updateData.addressType == "outside" && typeof updateData.address == 'string'? (await connection.query('INSERT INTO outside_ph_address (address) VALUES(?)', [updateData.address || null]) as OkPacket[])[0].insertId : null;
                //Remove currently related addresses FKeys
                await connection.query('UPDATE members_personal_info SET permanent_address_ph = NULL, permanent_address_out_ph = NULL WHERE id = ?', [getFKey.personal_info_id]);
                //Update new FKeys from members_personal_info table
                updateData.addressType == "local" && localAddress && await connection.query("UPDATE members_personal_info SET permanent_address_ph = ? WHERE id = ?", [localAddress, getFKey.personal_info_id]);
                updateData.addressType == "outside" && outsidePHAddress && await connection.query("UPDATE members_personal_info SET permanent_address_out_ph = ?  WHERE id = ?", [outsidePHAddress, getFKey.personal_info_id]);

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

export default updatePermanentAddress;
