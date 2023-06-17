import pool from "./pool";
import { OkPacket } from "mysql2";
import { generateMembersUID } from "../controller/generateUID";

type TAddressPH = {
    philippines: true,
    address: {
        region: string,
        province: string,
        cityOrMunicipality: string,
        barangay: string
    } 
}

type TAddressNonPH = {
    philippines: false,
    address: string
}

type TAddMemberRecordTransactionParam = {
    personalInformation: {
        firstName: string,
        middleName: string,
        surName: string,
        extName: string | null, 
        maritalStatus: string,
        dateOfBirth: string,
        gender: string,
    },
    contactInformation: {
        email: string | null,
        cpNumber: string | null,
        telephoneNumber: string | null,
    }, 
    currentAddress: TAddressPH | TAddressNonPH,
    permanentAddress: TAddressPH | TAddressNonPH,
    baptismInformation:  {
        dateOfBaptism: string
    } | null
}

async function addMemberRecordTransactionPromise(memberRecord: TAddMemberRecordTransactionParam, adminInfo: { congregation: string, adminUID: string}): Promise<{ querySuccess: boolean }> {
    const personalInfo = memberRecord.personalInformation;
    const contactInformation = memberRecord.contactInformation;
    const currentAddress = memberRecord.currentAddress;
    const permanentAddress = memberRecord.permanentAddress;
    const baptismInformation = memberRecord.baptismInformation

    const promisePool = pool.promise();

    const addFullNameQuery = "INSERT INTO full_name (first_name, sur_name, middle_name, ext_name) VALUES (?, ?, ?, ?)";
    const addPHPermanentAddressQuery = "INSERT INTO local_address_ph (region, province, mun_city, barangay) VALUES (?, ?, ?, ?)";
    const addNonPHPermanentAddressQuery = "INSERT INTO outside_ph_address (address) VALUES (?)";
    const addPHCurrentAddressQuery = "INSERT INTO local_address_ph (region, province, mun_city, barangay) VALUES (?, ?, ?, ?)";
    const addNonPHCurrentAddressQuery = "INSERT INTO outside_ph_address (address) VALUES (?)";
    const addMemberPersonalInfoQuery = "INSERT INTO members_personal_info (full_name, date_of_birth, gender, marital_status, current_address_ph, permanent_address_ph, current_address_out_ph, permanent_address_out_ph) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const addMemberContactInfoQuery = "INSERT INTO members_contact_info (cp_number, tel_number, email) VALUES (?, ?, ?)";
    const addBaptismInfoQuery = "INSERT INTO baptism_info (date_of_baptism) VALUES (?)";
    const addMemberQuery = "INSERT INTO members (member_uid, personal_info, contact_info, baptism_info) VALUES (?, ?, ?, ?)";
    const addMemberToCongregationQuery = "INSERT INTO congregation_members (congregation_uid, member_uid, created_by) VALUES (?, ?)";
  
    return new Promise<{ querySuccess: boolean }>((resolve, reject) => {
      promisePool.beginTransaction()
        .then(async () => {
                  //Query 1: Need to get the insertId to be a FKey for fullName
            const [addFullNameQueryResult] = await promisePool.query(addFullNameQuery, [personalInfo.firstName, personalInfo.middleName, personalInfo.extName]);
            const full_name_id = (addFullNameQueryResult as OkPacket).insertId;

            //Query 2: Insert Permanent Address, Need to check if the address is in the philippines
            const permanentAddressInserId = await (async () => {
                const [q] = permanentAddress.philippines? await promisePool.query(addPHPermanentAddressQuery, [permanentAddress.address.region, permanentAddress.address.province, permanentAddress.address.cityOrMunicipality, permanentAddress.address.barangay]) :  await promisePool.query(addNonPHPermanentAddressQuery, [permanentAddress.address]);
                const insertId = (q as OkPacket).insertId;
                return insertId;
            })();

            //Query 3: Insert Current Address, Need to check if the address is in the philippines
            const currentAddressInserId = await (async () => {
                const [q] = currentAddress.philippines? await promisePool.query(addPHCurrentAddressQuery, [currentAddress.address.region, currentAddress.address.province, currentAddress.address.cityOrMunicipality, currentAddress.address.barangay]) :  await promisePool.query(addNonPHCurrentAddressQuery, [currentAddress.address]);
                const insertId = (q as OkPacket).insertId;
                return insertId;
            })();

            //Query 4: Insert Members Personal Info including Address, insertId of fullName and both current and permanent address will be use. Need to get the insertId as a FKey for members_personal_info
            const [addMemberPersonalInfoQueryResult] = await promisePool.query(addMemberPersonalInfoQuery, [full_name_id, personalInfo.dateOfBirth, personalInfo.gender, personalInfo.maritalStatus, currentAddress.philippines? currentAddressInserId : null, permanentAddress.philippines? permanentAddressInserId : null, currentAddress.philippines? currentAddressInserId : null, permanentAddress.philippines? permanentAddressInserId : null]);
            const personalInfoInserID = (addMemberPersonalInfoQueryResult as OkPacket).insertId;

            //Query 5: Insert Contact Info. Check if all values are null, if true asign a null value as id else do the query and get the InsertId
            const [addMemberContactInfoQueryResult] = (contactInformation.cpNumber == null && contactInformation.telephoneNumber == null && contactInformation.email == null)? [null] : await promisePool.query(addMemberContactInfoQuery , [contactInformation.cpNumber, contactInformation.telephoneNumber, contactInformation.email]);
            const contactInformationID = addMemberContactInfoQueryResult == null? null : ( addMemberContactInfoQueryResult as OkPacket).insertId;

            //Query 6: Insert Baptism Information, Need to check if baptism info is not null; if null asign a null value or else do the query;
            const [addBaptismInfoQueryResult] = baptismInformation == null? [null] : await promisePool.query(addBaptismInfoQuery, [baptismInformation.dateOfBaptism]);
            const baptismInfoId = addBaptismInfoQueryResult == null? null : (addBaptismInfoQueryResult as OkPacket).insertId;

            //Query 7: Insert the group of FKeys personal info, contact info, baptism info, and the new generated UID for Member
            const memberUID = generateMembersUID();
            const [addMemberQueryResult] = await promisePool.query(addMemberQuery, [memberUID, personalInfoInserID, contactInformationID, baptismInfoId]);
            
            //Query 8: Finaly, Insert the memberUID to the congregation_members table
            const [addMemberToCongregationQueryResult] = await promisePool.query(addMemberToCongregationQuery, [adminInfo.congregation, memberUID, adminInfo.adminUID]);

            promisePool.commit()
            .then(() => {
                resolve({ querySuccess: true });
            })
            .catch((commitError) => {
                reject({
                    querySuccess: false,
                    error: commitError,
                });
            });
        })
        .catch((beginTransactionError) => {
            promisePool.rollback();
            reject({
                querySuccess: false,
                error: beginTransactionError,
            });
        });
    });
  }
  
  export default addMemberRecordTransactionPromise;
  