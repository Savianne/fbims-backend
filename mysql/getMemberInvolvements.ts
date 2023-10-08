import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

async function getMemberInvolvements(memberUID: string): Promise<{ success: boolean, error?: any, data?: any }> {
    const promisePool = pool.promise();
    return new Promise<{ success: boolean, error?: any, data?: any }>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                //Get ministries
                const ministries = ((await connection.query(`
                SELECT mm.ministry_uid AS ministryUID, a.avatar, mi.description, mi.ministry_name AS ministryName
                FROM ministry_members AS mm
                JOIN ministry AS m ON m.ministry_uid = mm.ministry_uid
                JOIN ministry_info AS mi ON m.ministry_info = mi.id
                LEFT JOIN avatar AS a ON m.avatar = a.id
                WHERE mm.member_uid = ?
                `, [memberUID]) as RowDataPacket[][])[0]);

                //Get Orgs
                const orgs = ((await connection.query(`
                SELECT om.organization_uid AS organizationUID, a.avatar, oi.description, oi.organization_name AS organizationName
                FROM organization_members AS om
                JOIN organizations AS o ON o.organization_uid = om.organization_uid
                JOIN organization_info AS oi ON o.organization_info = oi.id
                LEFT JOIN avatar AS a ON o.avatar = a.id
                WHERE om.member_uid = ?
                `, [memberUID]) as RowDataPacket[][])[0]);

                //Commit 
                connection.commit();
                connection.release();
                resolve({success: true, data: {ministries, orgs}});
            })
            .catch((beginTransactionError) => {
                connection.rollback();
                connection.release();
                reject({
                    success: false,
                    error: beginTransactionError,
                });
            });
        })
        .catch((getConnectionError) => {
            reject({
                success: false,
                error: getConnectionError,
            });
        })
    })
}


export default getMemberInvolvements;