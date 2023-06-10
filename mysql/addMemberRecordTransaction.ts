import pool from "./pool";
import { OkPacket } from "mysql2";

async function addMemberRecordTransaction(memberRecord: {}) {
    const promisePool = pool.promise();

    const addFullNameQuery = "INSERT INTO full_name (first_name, sur_name, middle_name, ext_name) VALUES (?, ?, ?, ?)";
    const addPermanentAddressQuery = "INSERT INTO local_address_ph (country, region, province, mun_city, barangay, street, zone, building) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const addCurrentAddressQuery = "INSERT INTO local_address_ph (country, region, province, mun_city, barangay, street, zone, building) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const addMemberPersonalInfoQuery = "INSERT INTO members_personal_info (full_name, date_of_birth, gender, marital_status, current_address, permanent_address) VALUES (?, ?, ?, ?, ?, ?)";
    const addMemberContactInfoQuery = "INSERT INTO members_contact_info (cp_number, tel_number, email) VALUES (?, ?, ?)";
    const addBaptismInfoQuery = "INSERT INTO baptism_info (date_of_baptism) VALUES (?, ?)";
    const addMemberQuery = "INSERT INTO members (member_uid, personal_info, contact_info, baptism_info) VALUES (?, ?, ?, ?)";
    const addMemberToCongregationQuery = "INSERT INTO congregation_members (congregation_uid, member_uid) VALUES (?, ?)";
    const addToMinistryQuery = "INSERT INTO ministry_members (ministry_uid, member_uid) VALUES (?, ?)"; 
    const addToOrgQuery = "INSERT INTO organization_members (organization_uid, member_uid) VALUES (?, ?)"; 

    promisePool.beginTransaction()
    .then(async () => {
        const [addFullNameQueryResult] = await promisePool.query(addFullNameQuery, []);
        const full_name_id = (addFullNameQueryResult as OkPacket).insertId;
        const [addPermanentAddressQueryResult] = await promisePool.query(addPermanentAddressQuery, []);
        const permanent_address_id = (addPermanentAddressQueryResult as OkPacket).insertId;
        const [addCurrentAddressQueryResult] = await promisePool.query(addCurrentAddressQuery, []);
        const current_address_id = (addPermanentAddressQueryResult as OkPacket).insertId;

        
    })
    .catch(error => {
        promisePool.rollback();
        throw({
            querySuccess: false,
            error: error
        })
    })
}

export default addMemberRecordTransaction;