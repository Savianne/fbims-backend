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
function updatePermanentAddress(memberUID, updateData) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            promisePool.getConnection()
                .then(connection => {
                connection.beginTransaction()
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    //get the FKeys
                    const getFKey = ((yield connection.query(`
                SELECT mpi.id AS personal_info_id, mpi.permanent_address_ph, mpi.permanent_address_out_ph
                FROM members AS m 
                    JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
                WHERE m.member_uid = ?
                `, [memberUID]))[0])[0];
                    //Delete Address outside ph
                    getFKey.permanent_address_out_ph && (yield connection.query("DELETE FROM outside_ph_address WHERE id = ?", [getFKey.permanent_address_out_ph]));
                    //DELETE Address PH
                    getFKey.permanent_address_ph && (yield connection.query("DELETE FROM local_address_ph WHERE id = ?", [getFKey.permanent_address_ph]));
                    //Insert new values
                    const localAddress = updateData.addressType == "local" && typeof updateData.address !== "string" ? (yield connection.query("INSERT INTO local_address_ph (region, province, mun_city, barangay) VALUES(?, ?, ?, ?)", [updateData.address.region, updateData.address.province, updateData.address.cityOrMunicipality, updateData.address.barangay]))[0].insertId : null;
                    const outsidePHAddress = updateData.addressType == "outside" && typeof updateData.address == 'string' ? (yield connection.query('INSERT INTO outside_ph_address (address) VALUES(?)', [updateData.address]))[0].insertId : null;
                    //Remove currently related addresses FKeys
                    yield connection.query('UPDATE members_personal_info SET permanent_address_ph = NULL, permanent_address_out_ph = NULL WHERE id = ?', [getFKey.personal_info_id]);
                    //Update new FKeys from members_personal_info table
                    updateData.addressType == "local" && localAddress && (yield connection.query("UPDATE members_personal_info SET permanent_address_ph = ? WHERE id = ?", [localAddress, getFKey.personal_info_id]));
                    updateData.addressType == "outside" && outsidePHAddress && (yield connection.query("UPDATE members_personal_info SET permanent_address_out_ph = ?  WHERE id = ?", [outsidePHAddress, getFKey.personal_info_id]));
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
exports.default = updatePermanentAddress;
