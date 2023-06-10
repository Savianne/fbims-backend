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
function addMemberRecordTransaction(token, exp_date) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        const addFullName = "INSERT INTO full_name (first_name, sur_name, middle_name, ext_name) VALUES (?, ?, ?, ?)";
        const addPermanentAddressQuery = "INSERT INTO local_address_ph (country, region, province, mun_city, barangay, street, zone, building) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const addCurrentAddressQuery = "INSERT INTO local_address_ph (country, region, province, mun_city, barangay, street, zone, building) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const addMemberPersonalInfoQuery = "INSERT INTO members_personal_info (full_name, date_of_birth, gender, marital_status, current_address, permanent_address) VALUES (?, ?, ?, ?, ?, ?)";
        const addMemberContactInfo = "INSERT INTO members_contact_info (cp_number, tel_number, email) VALUES (?, ?, ?)";
        const addMember = "INSERT INTO members (member_uid, personal_info, contact_info) VALUES (?, ?, ?)";
        const addMemberToCongregation = "INSERT INTO congregation_members (congregation_uid, member_uid) VALUES (?, ?)";
        const addToMinistry = "INSERT INTO ministry_members (ministry_uid, member_uid) VALUES (?, ?)";
        const addToOrg = "INSERT INTO organization_members (organization_uid, member_uid) VALUES (?, ?)";
        try {
            const [res] = yield promisePool.query("INSERT INTO refresh_token (refresh_token, exp_date) VALUES (?, ?)", [token, exp_date]);
            return res;
        }
        catch (error) {
            console.error("Error occurred while executing the query:", error);
            throw error; // Re-throw the error to be handled at the caller level
        }
    });
}
exports.default = addMemberRecordTransaction;
