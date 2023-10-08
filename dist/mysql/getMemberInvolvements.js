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
function getMemberInvolvements(memberUID) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            promisePool.getConnection()
                .then(connection => {
                connection.beginTransaction()
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    //Get ministries
                    const ministries = ((yield connection.query(`
                SELECT mm.ministry_uid AS ministryUID, a.avatar, mi.description, mi.ministry_name AS ministryName
                FROM ministry_members AS mm
                JOIN ministry AS m ON m.ministry_uid = mm.ministry_uid
                JOIN ministry_info AS mi ON m.ministry_info = mi.id
                LEFT JOIN avatar AS a ON m.avatar = a.id
                WHERE mm.member_uid = ?
                `, [memberUID]))[0]);
                    //Get Orgs
                    const orgs = ((yield connection.query(`
                SELECT om.organization_uid AS organizationUID, a.avatar, oi.description, oi.organization_name AS organizationName
                FROM organization_members AS om
                JOIN organizations AS o ON o.organization_uid = om.organization_uid
                JOIN organization_info AS oi ON o.organization_info = oi.id
                LEFT JOIN avatar AS a ON o.avatar = a.id
                WHERE om.member_uid = ?
                `, [memberUID]))[0]);
                    //Commit 
                    connection.commit();
                    connection.release();
                    resolve({ success: true, data: { ministries, orgs } });
                }))
                    .catch((beginTransactionError) => {
                    connection.rollback();
                    connection.release();
                    reject({
                        success: false,
                        error: beginTransactionError,
                    });
                });
            })
                .catch((getConnectionError) => {
                reject({
                    success: false,
                    error: getConnectionError,
                });
            });
        });
    });
}
exports.default = getMemberInvolvements;
