import pool from "./pool";

async function getUserAccountInfoByCPNumber(cp_number: number) {
    const promisePool = pool.promise();
    try {
        const [rows, fields] = await promisePool.query("SELECT * FROM admin_account WHERE cp_number = ?", [cp_number]);
        return rows;
    } catch(err) {
        throw err;
    }
}

export default getUserAccountInfoByCPNumber;