import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { generateMembersUID, generateUID } from "../controller/generateUID";
import { IQueryPromise } from "./IQueryPromise";

export type TOrgData = {
    name: string,
    description: string,
    avatar: string | null
}

async function addOrganizatioTransactionPromise(adminInfo: { congregation: string, adminUID: string}, orgData: TOrgData): Promise<{ querySuccess: boolean }> {
    const promisePool = pool.promise();

    return new Promise<IQueryPromise>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                const org_UID = generateUID();
                const addOrgInfoQ = "INSERT INTO organization_info (organization_name, description) VALUES (?, ?)";
                const addAvatarQ = "INSERT INTO avatar (avatar) VALUES (?)";
                const createOrgQ = "INSERT INTO organizations (organization_uid, organization_info, avatar) VALUES (?, ?, ?)";
                const addOrganizationToCongregation = "INSERT INTO congregation_organizations (congregation_uid, organization_uid, created_by) VALUES (?, ?, ?)";

                const [organizationInfoQResult] = await connection.query(addOrgInfoQ, [orgData.name || null, orgData.description || null]);
                const organizationInfoID = (organizationInfoQResult as OkPacket).insertId
                const [avatarQResult] = orgData.avatar? await connection.query(addAvatarQ, [orgData.avatar]) : [null];
                const avatarID = orgData.avatar? (avatarQResult as OkPacket).insertId : null;
                await connection.query(createOrgQ, [org_UID, organizationInfoID, avatarID]);
                await connection.query(addOrganizationToCongregation, [adminInfo.congregation, org_UID, adminInfo.adminUID]);

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


export default addOrganizatioTransactionPromise;