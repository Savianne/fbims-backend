import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { generateMembersUID } from "../controller/generateUID";
import { IQueryPromise } from "./IQueryPromise";

type TRecordFKeys = {
    personalInfoId: string,
    fullNameId: string,
    contactInfoId: string | null,
    currentAddressOutPhId: string | null,
    baptismInfoId: string | null,
    avatarId: string | null,
    currentAddressPhId: string | null,
    permanentAddressOutPhId: string | null,
    permanentAddressPhId: string | null
}

async function deleteMemberRecordTransactionPromise(memberUID: string): Promise<{ querySuccess: boolean }> {

    const getRecordFKeysQ = `
        SELECT 
            m.personal_info AS personalInfoId, 
            m.contact_info AS contactInfoId, 
            m.baptism_info AS baptismInfoId, 
            m.avatar AS avatarId, 
            mpi.full_name AS fullNameId,
            mpi.current_address_out_ph AS currentAddressOutPhId,
            mpi.current_address_ph AS currentAddressPhId,
            mpi.permanent_address_out_ph AS permanentAddressOutPhId,
            mpi.permanent_address_ph AS permanentAddressPhId
        FROM members AS m
        JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
        WHERE m.member_uid = ?`;

    const deleteCurrentAddressOutPhQ = "DELETE FROM outside_ph_address WHERE id = ?";
    const deleteCurrentAddresPh = "DELETE FROM local_address_ph WHERE id = ?";
    const deletePermanentAddressOutPhQ = "DELETE FROM outside_ph_address WHERE id = ?";
    const deletePermanentAddressPhQ = "DELETE FROM local_address_ph WHERE id = ?";
    const deleteFullNameQ = "DELETE FROM full_name WHERE id = ?";
    const deletePersonalInfoQ = "DELETE FROM members_personal_info WHERE id = ?";
    const deleteContactInfoQ = "DELETE FROM members_contact_info WHERE id = ?";
    const deleteBaptismInfoQ = "DELETE FROM baptism_info WHERE id = ?";
    const deleteAvatarQ = "DELETE FROM avatar WHERE id = ?";
    const deleteMembersQ  = "DELETE FROM members WHERE member_uid = ?";
    const deleteCongragationMemberQ = "DELETE FROM congregation_members WHERE member_uid = ?"

    const promisePool = pool.promise();

    return new Promise<IQueryPromise>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                const getRecordFKeysQResult = await connection.query(getRecordFKeysQ, [memberUID]);
                const recordFKeys = ((getRecordFKeysQResult as RowDataPacket[][])[0])[0] as TRecordFKeys;
                
                //Start deletion
                recordFKeys.currentAddressOutPhId && await connection.query(deleteCurrentAddressOutPhQ, [recordFKeys.currentAddressOutPhId]);
                recordFKeys.currentAddressPhId && await connection.query(deleteCurrentAddresPh, [recordFKeys.currentAddressPhId]);
                recordFKeys.permanentAddressOutPhId && await connection.query(deletePermanentAddressOutPhQ, [recordFKeys.currentAddressOutPhId]);
                recordFKeys.permanentAddressPhId && await connection.query(deletePermanentAddressPhQ, [recordFKeys.permanentAddressPhId]);
                await connection.query(deleteFullNameQ, [recordFKeys.fullNameId]);
                await connection.query(deletePersonalInfoQ, [recordFKeys.personalInfoId]);
                recordFKeys.contactInfoId && await connection.query(deleteContactInfoQ, [recordFKeys.contactInfoId]);
                recordFKeys.baptismInfoId && await connection.query(deleteBaptismInfoQ, [recordFKeys.baptismInfoId]);
                recordFKeys.avatarId && await connection.query(deleteAvatarQ, [recordFKeys.avatarId]);

                await connection.query(deleteMembersQ, [memberUID]);
                await connection.query(deleteCongragationMemberQ, [memberUID]);
                
                //Commit 
                connection.commit()
                connection.release();
                resolve({querySuccess: true});
            })
            .catch((beginTransactionError) => {
                connection.rollback();
                connection.release();
                console.log(beginTransactionError)
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


export default deleteMemberRecordTransactionPromise;