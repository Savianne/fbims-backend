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
function updateContactInfo(memberUID, updateData) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        console.log(updateData);
        return new Promise((resolve, reject) => {
            promisePool.getConnection()
                .then(connection => {
                connection.beginTransaction()
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    //get the FKeys
                    const getFKey = ((yield connection.query(`SELECT contact_info, home_contact_info FROM members WHERE member_uid = ?`, [memberUID]))[0])[0];
                    console.log(getFKey);
                    updateData.label == "personal" && getFKey.contact_info && (yield connection.query(`
                UPDATE members_contact_info SET email = ?, cp_number = ?, tel_number = ? WHERE id = ?                
                `, [updateData.email, updateData.cpNumber, updateData.telephoneNumber, getFKey.contact_info]));
                    updateData.label == "home" && getFKey.home_contact_info && (yield connection.query(`
                UPDATE members_home_contact_info SET email = ?, cp_number = ?, tel_number = ? WHERE id = ?                
                `, [updateData.email, updateData.cpNumber, updateData.telephoneNumber, getFKey.home_contact_info]));
                    const newPersonalContactInfoId = updateData.label == "personal" && getFKey.contact_info == null ?
                        (yield connection.query(`INSERT INTO members_contact_info (email, cp_number, tel_number) VALUES(?, ?, ?)`, [updateData.email, updateData.cpNumber, updateData.telephoneNumber]))[0].insertId
                        : null;
                    const newHomeContactInfoId = updateData.label == "home" && getFKey.home_contact_info == null ?
                        (yield connection.query(`INSERT INTO members_home_contact_info (email, cp_number, tel_number) VALUES(?, ?, ?)`, [updateData.email, updateData.cpNumber, updateData.telephoneNumber]))[0].insertId
                        : null;
                    updateData.label == "personal" && getFKey.contact_info == null && newPersonalContactInfoId && (yield connection.query(`UPDATE members SET contact_info = ? WHERE member_uid = ?`, [newPersonalContactInfoId, memberUID]));
                    updateData.label == "home" && getFKey.home_contact_info == null && newHomeContactInfoId && (yield connection.query(`UPDATE members SET home_contact_info = ? WHERE member_uid = ?`, [newHomeContactInfoId, memberUID]));
                    //Commit 
                    connection.commit();
                    connection.release();
                    resolve({ querySuccess: true });
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
exports.default = updateContactInfo;
