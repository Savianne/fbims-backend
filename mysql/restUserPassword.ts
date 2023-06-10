import pool from "./pool";
import { OkPacket } from "mysql2";

async function resetUserPassword(email: string, newPassword: string) {
    const promisePool = pool.promise();
    try {
        const [res] = await promisePool.query(
            "UPDATE admin_account SET password = ? WHERE email = ?",
            [newPassword, email]
        );

        return res as OkPacket;
      } catch (error) {
        console.error("Error occurred while executing the query:", error);

        throw error; // Re-throw the error to be handled at the caller level
      }
}

export default resetUserPassword;