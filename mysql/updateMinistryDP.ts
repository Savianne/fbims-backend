import fs from "fs";
import fsx from "fs-extra";
import path from "path";
import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { IQueryPromise } from "./IQueryPromise";

interface IDisplayPictureUpdate {
    query: "remove" | "update",
    picture: string
}

async function updateMinistryDisplayPicture(ministryUID: string, updateData: IDisplayPictureUpdate): Promise<{ querySuccess: boolean }> {
    const promisePool = pool.promise();
    return new Promise<IQueryPromise>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                //get the FKeys
                const getFKey = ((await connection.query(`
                SELECT avatar FROM ministry WHERE ministry_uid = ?
                `, [ministryUID]) as RowDataPacket[][])[0])[0];
                
                updateData.query == "remove" && await (async () => {
                    await connection.query("DELETE FROM avatar WHERE id = ?", [getFKey.avatar]);
                    await connection.query("UPDATE ministry SET avatar = NULL WHERE ministry_uid = ?", [ministryUID]); 
                    const imagesFolder = path.join(__dirname, '../../public/assets/images/avatar');
                    const imageName = updateData.picture;
                    const imagePath = path.join(imagesFolder, imageName);
                    // Check if the image file exists and then delete
                    fs.existsSync(imagePath) && fs.unlinkSync(imagePath);
                })();

                
                updateData.query == "update" && await (async () => {
                    await fsx.move(path.join(__dirname, "../../", "tmp-upload", updateData.picture), path.join(__dirname, "../../", "public/assets/images/avatar", updateData.picture));
                
                    getFKey.avatar && await connection.query(`UPDATE avatar SET avatar = ? WHERE id = ?`, [updateData.picture, getFKey.avatar]);
                    const newFkey = getFKey.avatar == null? (await connection.query(`INSERT INTO avatar (avatar) VALUES(?)`, [updateData.picture]) as OkPacket[])[0].insertId : null;
                    newFkey && await connection.query(`UPDATE ministry SET avatar = ? WHERE ministry_uid = ?`, [newFkey, ministryUID]);
                      
                })()

                //Commit 
                connection.commit();
                connection.release();
                resolve({querySuccess: true});
            })
            .catch((beginTransactionError) => {
                console.log("connection rolled back")
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

export default updateMinistryDisplayPicture;