import pool from "./pool";

async function getUserAccountInfoByEmail(email: string) {
    const promisePool = pool.promise();
    try {
        const [rows, fields] = await promisePool.query("SELECT * FROM admin_account WHERE email = ?", [email]);
        return rows;
    } catch(err) {
        throw err;
    }
}

export default getUserAccountInfoByEmail;