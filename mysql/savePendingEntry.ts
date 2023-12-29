import pool from "./pool";

async function savePendingEntry(entryUID: string): Promise<{ querySuccess: boolean, error?: any}> {
    const promisePool = pool.promise();

    return new Promise<{ querySuccess: boolean, error?: any}>((resolve, reject) => {
        promisePool.getConnection()
        .then(connection => {
            connection.beginTransaction()
            .then(async () => {
                //check if 
                await connection.query("DELETE FROM pending_attendance_entries WHERE entry_uid = ?", [entryUID]);

                await connection.query("INSERT INTO submitted_attendance_entries (entry_uid) VALUES(?)", [entryUID]);
                
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


export default savePendingEntry;