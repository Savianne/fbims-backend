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
function updateMemberAddress(memberUID, updateData) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            promisePool.getConnection()
                .then(connection => {
                connection.beginTransaction()
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    //get the FKeys
                    const getFKey = ((yield connection.query(`
                SELECT mpi.id AS personal_info_id, mpi.permanent_address_ph, mpi.permanent_address_out_ph, mpi.current_address_ph, mpi.current_address_ph
                FROM members AS m 
                    JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
                WHERE m.member_uid = ?
                `, [memberUID]))[0])[0];
                    //Update full Name
                    yield connection.query(`
                UPDATE full_name SET first_name = ?, middle_name = ?, surname = ?, ext_name = ?
                WHERE id = ?
                `, [updateData.first_name, updateData.middle_name, updateData.surname, updateData.ext_name, getFKey.full_name]);
                    yield connection.query(`
                UPDATE members_personal_info SET gender = ?, marital_status = ?, date_of_birth = ?
                WHERE id = ?
                `, [updateData.gender, updateData.marital_status, updateData.date_of_birth, getFKey.personal_info_id]);
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
exports.default = updateMemberAddress;
