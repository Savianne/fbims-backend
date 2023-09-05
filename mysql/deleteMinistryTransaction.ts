import fs from "fs";
import path from "path";
import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

async function deleteMinistryTransactionPromise(ministryUID: string): Promise<{ querySuccess: boolean }> {
    const promisePool = pool.promise();

    return new Promise<IQueryPromise>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                //Get Ministry Info id and avatar id query
                const getIdsQ = "SELECT ministry_info, avatar FROM ministry WHERE ministry_uid = ?";
                //Delete Ministry info
                const deleteMinistryInfoQ = "DELETE FROM ministry_info WHERE id = ?";
                //Delete Ministry avatar
                const deleteMinistryAvatarQ = "DELETE FROM avatar WHERE id = ?";
                //Get avatar name
                const getAvatarNameQ = "SELECT avatar from avatar WHERE id =  ?";
                //Delete ministry from ministry table
                const deleteMinistryQ = "DELETE FROM ministry WHERE ministry_uid = ?";
                //Delete from congregation_ministry table
                const deleteCongregationMinistryQ = "DELETE FROM congregation_ministry WHERE ministry_uid = ?";
                //Delete from ministry_members table
                const deleteMinistryMembersQ = "DELETE FROM ministry_members WHERE ministry_uid = ?";

                const getRecordFKeysQResult = ((await connection.query(getIdsQ, [ministryUID]) as RowDataPacket[][])[0])[0] as { ministry_info: string, avatar: string};
                console.log(getRecordFKeysQResult)
                //Delete Ministry info
                await connection.query(deleteMinistryInfoQ, [getRecordFKeysQResult.ministry_info])                

                //Get avatar name 
                const avatarName = getRecordFKeysQResult.avatar? ((await connection.query(getAvatarNameQ, [getRecordFKeysQResult.avatar]) as RowDataPacket[][])[0])[0] as { avatar: string } : null;

                //Delete ministry avatar 
                getRecordFKeysQResult.avatar && await connection.query(deleteMinistryAvatarQ, [getRecordFKeysQResult.avatar]);
                
                //Delete avatar file
                getRecordFKeysQResult.avatar && (() => {
                    const imagesFolder = path.join(__dirname, '../../public/assets/images/avatar');
                    const imageName = avatarName?.avatar;
                    const imagePath = path.join(imagesFolder, imageName as string);

                    console.log(imagePath)
  
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

                //Delete Ministry from ministry table
                await connection.query(deleteMinistryQ, [ministryUID]);
                
                //Delete from congregation_ministry table
                await connection.query(deleteCongregationMinistryQ, [ministryUID]);

                //Delete from ministry_members table
                await connection.query(deleteMinistryMembersQ, [ministryUID]);

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

export default deleteMinistryTransactionPromise