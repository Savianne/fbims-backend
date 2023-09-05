"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = __importDefault(require("./pool"));
const generateUID_1 = require("../controller/generateUID");
function addMemberRecordTransactionPromise(memberRecord, adminInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const personalInfo = memberRecord.personalInformation;
        const contactInformation = memberRecord.contactInformation;
        const homeContactInfo = memberRecord.homeContactInformation;
        const currentAddress = memberRecord.currentAddress;
        const permanentAddress = memberRecord.permanentAddress;
        const baptismInformation = memberRecord.baptismInformation;
        const promisePool = pool_1.default.promise();
        const addFullNameQuery = "INSERT INTO full_name (first_name, middle_name, surname, ext_name) VALUES (?, ?, ?, ?)";
        const addPHPermanentAddressQuery = "INSERT INTO local_address_ph (region, province, mun_city, barangay) VALUES (?, ?, ?, ?)";
        const addNonPHPermanentAddressQuery = "INSERT INTO outside_ph_address (address) VALUES (?)";
        const addPHCurrentAddressQuery = "INSERT INTO local_address_ph (region, province, mun_city, barangay) VALUES (?, ?, ?, ?)";
        const addNonPHCurrentAddressQuery = "INSERT INTO outside_ph_address (address) VALUES (?)";
        const addMemberPersonalInfoQuery = "INSERT INTO members_personal_info (full_name, date_of_birth, gender, marital_status, current_address_ph, permanent_address_ph, current_address_out_ph, permanent_address_out_ph) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const addMemberContactInfoQuery = "INSERT INTO members_contact_info (cp_number, tel_number, email) VALUES (?, ?, ?)";
        const addMemberHomeContactInfoQuery = "INSERT INTO members_home_contact_info (cp_number, tel_number, email) VALUES (?, ?, ?)";
        const addBaptismInfoQuery = "INSERT INTO baptism_info (date_of_baptism) VALUES (?)";
        const addAvatarQ = "INSERT INTO avatar (avatar) VALUES (?)";
        const addMemberQuery = "INSERT INTO members (member_uid, personal_info, contact_info, home_contact_info, baptism_info, avatar) VALUES (?, ?, ?, ?, ?, ?)";
        const addMemberToCongregationQuery = "INSERT INTO congregation_members (congregation_uid, member_uid, created_by) VALUES (?, ?, ?)";
        return new Promise((resolve, reject) => {
            promisePool.getConnection()
                .then(connection => {
                connection.beginTransaction()
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    //Query 1: Need to get the insertId to be a FKey for fullName
                    const [addFullNameQueryResult] = yield connection.query(addFullNameQuery, [personalInfo.firstName, personalInfo.middleName, personalInfo.surName, personalInfo.extName]);
                    const full_name_id = addFullNameQueryResult.insertId;
                    //Query 2: Insert Permanent Address, Need to check if the address is in the philippines
                    const permanentAddressInserId = yield (() => __awaiter(this, void 0, void 0, function* () {
                        const [q] = permanentAddress.philippines ? yield connection.query(addPHPermanentAddressQuery, [permanentAddress.address.region, permanentAddress.address.province, permanentAddress.address.cityOrMunicipality, permanentAddress.address.barangay]) : yield connection.query(addNonPHPermanentAddressQuery, [permanentAddress.address]);
                        const insertId = q.insertId;
                        return insertId;
                    }))();
                    //Query 3: Insert Current Address, Need to check if the address is in the philippines
                    const currentAddressInserId = yield (() => __awaiter(this, void 0, void 0, function* () {
                        const [q] = currentAddress.philippines ? yield connection.query(addPHCurrentAddressQuery, [currentAddress.address.region, currentAddress.address.province, currentAddress.address.cityOrMunicipality, currentAddress.address.barangay]) : yield connection.query(addNonPHCurrentAddressQuery, [currentAddress.address]);
                        const insertId = q.insertId;
                        return insertId;
                    }))();
                    //Query 4: Insert Members Personal Info including Address, insertId of fullName and both current and permanent address will be use. Need to get the insertId as a FKey for members_personal_info
                    const [addMemberPersonalInfoQueryResult] = yield connection.query(addMemberPersonalInfoQuery, [full_name_id, personalInfo.dateOfBirth, personalInfo.gender, personalInfo.maritalStatus, currentAddress.philippines ? currentAddressInserId : null, permanentAddress.philippines ? permanentAddressInserId : null, !currentAddress.philippines ? currentAddressInserId : null, !permanentAddress.philippines ? permanentAddressInserId : null]);
                    const personalInfoInserID = addMemberPersonalInfoQueryResult.insertId;
                    //Query 5: Insert Contact Info. Check if all values are null, if true asign a null value as id else do the query and get the InsertId
                    const [addMemberContactInfoQueryResult] = (contactInformation.cpNumber == null && contactInformation.telephoneNumber == null && contactInformation.email == null) ? [null] : yield connection.query(addMemberContactInfoQuery, [contactInformation.cpNumber, contactInformation.telephoneNumber, contactInformation.email]);
                    const contactInformationID = addMemberContactInfoQueryResult == null ? null : addMemberContactInfoQueryResult.insertId;
                    //Query 6: Insert home Contact Info. Check if all values are null, if true asign a null value as id else do the query and get the InsertId
                    const [addMemberHomeContactInfoQueryResult] = (homeContactInfo.cpNumber == null && homeContactInfo.telephoneNumber == null && homeContactInfo.email == null) ? [null] : yield connection.query(addMemberHomeContactInfoQuery, [homeContactInfo.cpNumber, homeContactInfo.telephoneNumber, homeContactInfo.email]);
                    const homeContactInformationID = addMemberHomeContactInfoQueryResult == null ? null : addMemberHomeContactInfoQueryResult.insertId;
                    //Query 6: Insert Baptism Information, Need to check if baptism info is not null; if null asign a null value or else do the query;
                    const [addBaptismInfoQueryResult] = baptismInformation == null ? [null] : yield connection.query(addBaptismInfoQuery, [baptismInformation.dateOfBaptism]);
                    const baptismInfoId = addBaptismInfoQueryResult == null ? null : addBaptismInfoQueryResult.insertId;
                    const [avatarQResult] = personalInfo.avatar ? yield connection.query(addAvatarQ, [personalInfo.avatar]) : [null];
                    const avatarID = personalInfo.avatar ? avatarQResult.insertId : null;
                    //Query 7: Insert the group of FKeys personal info, contact info, baptism info, and the new generated UID for Member
                    const memberUID = (0, generateUID_1.generateMembersUID)();
                    const [addMemberQueryResult] = yield connection.query(addMemberQuery, [memberUID, personalInfoInserID, contactInformationID, homeContactInformationID, baptismInfoId, avatarID]);
                    //Query 8: Finaly, Insert the memberUID to the congregation_members table
                    const [addMemberToCongregationQueryResult] = yield connection.query(addMemberToCongregationQuery, [adminInfo.congregation, memberUID, adminInfo.adminUID]);
                    connection.commit()
                        .then(() => {
                        connection.release();
                        resolve({ querySuccess: true });
                    })
                        .catch((commitError) => {
                        connection.release();
                        reject({
                            querySuccess: false,
                            error: commitError,
                        });
                    });
                }))
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
            });
        });
    });
}
exports.default = addMemberRecordTransactionPromise;
