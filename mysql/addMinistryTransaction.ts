import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { generateMembersUID, generateUID } from "../controller/generateUID";
import { IQueryPromise } from "./IQueryPromise";

export type TMinistryData = {
    name: string,
    description: string,
    avatar: string | null
}

async function addMinistryTransactionPromise(adminInfo: { congregation: string, adminUID: string}, ministryData: TMinistryData): Promise<{ querySuccess: boolean }> {
    const promisePool = pool.promise();

    return new Promise<IQueryPromise>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                const ministry_UID = generateUID();
                const addMinistryInfoQ = "INSERT INTO ministry_info (ministry_name, description) VALUES (?, ?)";
                const addAvatarQ = "INSERT INTO avatar (avatar) VALUES (?)";
                const createMinistryQ = "INSERT INTO ministry (ministry_uid, ministry_info, avatar) VALUES (?, ?, ?)";
                const addMinistryToCongregation = "INSERT INTO congregation_ministry (congregation_uid, ministry_uid, created_by) VALUES (?, ?, ?)";

                const [ministryInfoQResult] = await connection.query(addMinistryInfoQ, [ministryData.name || null, ministryData.description || null]);
                const ministryInfoID = (ministryInfoQResult as OkPacket).insertId
                const [avatarQResult] = ministryData.avatar? await connection.query(addAvatarQ, [ministryData.avatar]) : [null];
                const avatarID = ministryData.avatar? (avatarQResult as OkPacket).insertId : null;
                await connection.query(createMinistryQ, [ministry_UID, ministryInfoID, avatarID]);
                await connection.query(addMinistryToCongregation, [adminInfo.congregation, ministry_UID, adminInfo.adminUID]);

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


export default addMinistryTransactionPromise;