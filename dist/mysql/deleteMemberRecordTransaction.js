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
function deleteMemberRecordTransactionPromise(memberUID) {
    return __awaiter(this, void 0, void 0, function* () {
        const getRecordFKeysQ = `
        SELECT 
            m.personal_info AS personalInfoId, 
            m.contact_info AS contactInfoId, 
            m.baptism_info AS baptismInfoId, 
            m.avatar AS avatarId, 
            mpi.full_name AS fullNameId,
            mpi.current_address_out_ph AS currentAddressOutPhId,
            mpi.current_address_ph AS currentAddressPhId,
            mpi.permanent_address_out_ph AS permanentAddressOutPhId,
            mpi.permanent_address_ph AS permanentAddressPhId
        FROM members AS m
        JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
        WHERE m.member_uid = ?`;
        const deleteCurrentAddressOutPhQ = "DELETE FROM outside_ph_address WHERE id = ?";
        const deleteCurrentAddresPh = "DELETE FROM local_address_ph WHERE id = ?";
        const deletePermanentAddressOutPhQ = "DELETE FROM outside_ph_address WHERE id = ?";
        const deletePermanentAddressPhQ = "DELETE FROM local_address_ph WHERE id = ?";
        const deleteFullNameQ = "DELETE FROM full_name WHERE id = ?";
        const deletePersonalInfoQ = "DELETE FROM members_personal_info WHERE id = ?";
        const deleteContactInfoQ = "DELETE FROM members_contact_info WHERE id = ?";
        const deleteBaptismInfoQ = "DELETE FROM baptism_info WHERE id = ?";
        const deleteAvatarQ = "DELETE FORM avatar WHERE id = ?";
        const deleteMembersQ = "DELETE FROM members WHERE member_uid = ?";
        const deleteCongragationMemberQ = "DELETE FROM congregation_members WHERE member_uid = ?";
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            promisePool.getConnection()
                .then(connection => {
                connection.beginTransaction()
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    const getRecordFKeysQResult = yield connection.query(getRecordFKeysQ, [memberUID]);
                    const recordFKeys = (getRecordFKeysQResult[0])[0];
                    //Start deletion
                    recordFKeys.currentAddressOutPhId && (yield connection.query(deleteCurrentAddressOutPhQ, [recordFKeys.currentAddressOutPhId]));
                    recordFKeys.currentAddressPhId && (yield connection.query(deleteCurrentAddresPh, [recordFKeys.currentAddressPhId]));
                    recordFKeys.permanentAddressOutPhId && (yield connection.query(deletePermanentAddressOutPhQ, [recordFKeys.currentAddressOutPhId]));
                    recordFKeys.permanentAddressPhId && (yield connection.query(deletePermanentAddressPhQ, [recordFKeys.permanentAddressPhId]));
                    yield connection.query(deleteFullNameQ, [recordFKeys.fullNameId]);
                    yield connection.query(deletePersonalInfoQ, [recordFKeys.personalInfoId]);
                    recordFKeys.contactInfoId && (yield connection.query(deleteContactInfoQ, [recordFKeys.contactInfoId]));
                    recordFKeys.baptismInfoId && (yield connection.query(deleteBaptismInfoQ, [recordFKeys.baptismInfoId]));
                    recordFKeys.avatarId && (yield connection.query(deleteAvatarQ, [recordFKeys.avatarId]));
                    yield connection.query(deleteMembersQ, [memberUID]);
                    yield connection.query(deleteCongragationMemberQ, [memberUID]);
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
exports.default = deleteMemberRecordTransactionPromise;
