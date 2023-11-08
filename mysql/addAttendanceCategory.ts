import pool from "./pool";
import { OkPacket, RowDataPacket } from "mysql2";
import { generateUID } from "../controller/generateUID";

export type TCategoryData = {
    title: string,
    type: "basic" | "detailed",
    attender: "all" | "select",
    attenders: string[]
}

async function addCategoryTransactionPromise(congregation: string, categoryData: TCategoryData): Promise<{ querySuccess: boolean, error?: any, uid: string }> {
    const promisePool = pool.promise();

    return new Promise<{ querySuccess: boolean, error?: any, uid: string}>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                const UID = generateUID();
                //Insery category and get the insert Id
                await connection.query("INSERT INTO attendance_categories (uid, title, attender, type) VALUES(?, ?, ?, ?)", [UID, categoryData.title, categoryData.attender, categoryData.type]);

                //Insert attenders if the attender is select
                categoryData.attender == "select" && await (async () => {
                    for(let n = 0; n < categoryData.attenders?.length; n++) {
                        await connection.query("INSERT INTO attendance_category_attenders (member_uid, category_id) VALUES(?, ?)", [categoryData.attenders[n], UID])
                    }
                })();

                //Insert to congregation_attendance_category
                await connection.query("INSERT INTO congregation_attendance_category (congregation_uid, category_uid) VALUES(?, ?)", [congregation, UID]);

                //Commit 
                connection.commit();
                connection.release();
                resolve({querySuccess: true, uid: UID});
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


export default addCategoryTransactionPromise;