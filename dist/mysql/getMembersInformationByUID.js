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
function getMembersInfoByUID(membersUID) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            const query = `
        SELECT fn.first_name, fn.middle_name, fn.surname, fn.ext_name, ci.cp_number AS personalCPNumber, ci.email AS personalEmail, ci.tel_number AS personalTelNumber,
            hci.cp_number AS homeCPNUmber, hci.email AS homeEmail, hci.tel_number AS homeTelNumber,
            lap.region AS localCurrentAddressRegion, lap.province AS localCurrentAddressProvince, lap.mun_city AS localCurrentAddressMunCity, lap.barangay AS localCurrentAddressBarangay,
            lap2.region AS localPermanentAddressRegion, lap2.province AS localPermanentAddressProvince, lap2.mun_city AS localPermanentAddressMunCity, lap2.barangay AS localPermanentAddressBarangay, 
            opa.address AS outsidePHCurrentAddress, 
            opa2.address AS outsidePHpermanentAddress,
            bi.date_of_baptism,
            a.avatar,
            m.member_uid,
            pi.gender,
            pi.date_of_birth,
            pi.marital_status
        FROM members AS m
        JOIN members_personal_info AS pi ON m.personal_info = pi.id
        JOIN full_name AS fn ON pi.full_name = fn.id
        LEFT JOIN local_address_ph AS lap ON pi.current_address_ph = lap.id
        LEFT JOIN local_address_ph AS lap2 ON pi.permanent_address_ph = lap2.id
        LEFT JOIN outside_ph_address AS opa ON pi.current_address_out_ph = opa.id
        LEFT JOIN outside_ph_address AS opa2 ON pi.permanent_address_out_ph = opa2.id
        LEFT JOIN members_contact_info AS ci ON m.contact_info = ci.id
        LEFT JOIN members_home_contact_info AS hci ON m.home_contact_info = hci.id
        LEFT JOIN baptism_info AS bi ON m.baptism_info = bi.id
        LEFT JOIN avatar AS a ON m.avatar = a.id
        WHERE m.member_uid = ?
        `;
            promisePool.query(query, [membersUID])
                .then(res => {
                const record = res[0][0];
                resolve({ querySuccess: true, result: record });
            })
                .catch(err => {
                console.log(err);
                reject({ querySuccess: false, error: err });
            });
        });
    });
}
;
exports.default = getMembersInfoByUID;
