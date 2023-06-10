import pool from "./pool";
import { OkPacket } from "mysql2";

async function addRequestAccess(data: {congregation_name: string, email: string, cp_number: number, region: string, province: string, city_mun: string, barangay: string, mission: string, vision: string}) {
    const promisePool = pool.promise();
    try {
        const [res] = await promisePool.query(
            "INSERT INTO access_request (congregation_name, email, cp_number, region, province, city_mun, barangay, mission, vision) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [data.congregation_name, data.email, data.cp_number, data.region, data.province, data.city_mun, data.barangay, data.mission, data.vision]
        );
        return res as OkPacket;
      } catch (error) {
        throw error; // Re-throw the error to be handled at the caller level
      }
}

export default addRequestAccess;