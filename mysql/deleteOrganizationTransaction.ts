import fs from "fs";
import path from "path";
import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

async function deleteOrganizationTransactionPromise(organizationUID: string): Promise<{ querySuccess: boolean }> {
    const promisePool = pool.promise();

    return new Promise<IQueryPromise>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                //Get Organization Info id and avatar id query
                const getIdsQ = "SELECT organization_info, avatar FROM organizations WHERE organization_uid = ?";
                //Delete Organization info
                const deletOrganizationInfoQ = "DELETE FROM organization_info WHERE id = ?";
                //Delete Ministry avatar
                const deleteOrganizationAvatarQ = "DELETE FROM avatar WHERE id = ?";
                //Get avatar name
                const getAvatarNameQ = "SELECT avatar from avatar WHERE id =  ?";
                //Delete organization from organizations table
                const deleteOrganizationQ = "DELETE FROM organizations WHERE organization_uid = ?";
                //Delete from congregation_organizations table
                const deleteCongregationOrganizationsQ = "DELETE FROM congregation_organizations WHERE organization_uid = ?";
                //Delete from organization_members table
                const deleteOrganizationMembersQ = "DELETE FROM organization_members WHERE organization_uid = ?";

                const getRecordFKeysQResult = ((await connection.query(getIdsQ, [organizationUID]) as RowDataPacket[][])[0])[0] as { organization_info: string, avatar: string};
                
                //Delete Organization info
                await connection.query(deletOrganizationInfoQ, [getRecordFKeysQResult.organization_info])                

                //Get avatar name 
                const avatarName = getRecordFKeysQResult.avatar? ((await connection.query(getAvatarNameQ, [getRecordFKeysQResult.avatar]) as RowDataPacket[][])[0])[0] as { avatar: string } : null;

                //Delete ministry avatar 
                getRecordFKeysQResult.avatar && await connection.query(deleteOrganizationAvatarQ, [getRecordFKeysQResult.avatar]);
                
                //Delete avatar file
                getRecordFKeysQResult.avatar && (() => {
                    const imagesFolder = path.join(__dirname, '../../public/assets/images/avatar');
                    const imageName = avatarName?.avatar;
                    const imagePath = path.join(imagesFolder, imageName as string);
  
                    try {
                    // Check if the image file exists
                    if (fs.existsSync(imagePath)) {
                        // Delete the image file
                        fs.unlinkSync(imagePath);
                    } else {
                        console.log("Image not found")
                    }
                    } catch (error) {
                        throw "Failed to delete image"
                    }
                })();

                //Delete Organization from ministry table
                await connection.query(deleteOrganizationQ, [organizationUID]);
                
                //Delete from congregation_organizations table
                await connection.query(deleteCongregationOrganizationsQ, [organizationUID]);

                //Delete from organization_members table
                await connection.query(deleteOrganizationMembersQ, [organizationUID]);

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

export default deleteOrganizationTransactionPromise;