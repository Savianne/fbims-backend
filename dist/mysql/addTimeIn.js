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
function addTimeIn(congregationUID, categoryUID, entry) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            promisePool.getConnection()
                .then(connection => {
                connection.beginTransaction()
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    //Check if member_uid is a belong to the congregation member_uid's
                    const member_uid_exist = (yield connection.query("SELECT * FROM congregation_members WHERE congregation_uid  = ? AND member_uid = ?", [congregationUID, entry.memberUID]))[0].length;
                    if (member_uid_exist == 0)
                        throw "Unkown ID";
                    //Check if Entry still exist
                    const entryStillExist = (yield connection.query("SELECT * FROM attendance_entries WHERE entry_uid = ?", [entry.entryUID]))[0].length;
                    if (entryStillExist == 0)
                        throw "Entry does not exist";
                    //check if session still exist
                    const sessionExist = (yield connection.query("SELECT * FROM entry_session WHERE id = ? AND entry_uid = ?", [entry.session, entry.entryUID]))[0].length;
                    if (sessionExist == 0)
                        throw "Session does not exist";
                    //Check if member is attender of the entry
                    const isAttender = entry.attender == "select" &&
                        (yield connection.query("SELECT * FROM attendance_category_attenders WHERE member_uid = ? AND category_id = ?", [entry.memberUID, categoryUID]))[0].length;
                    if (entry.attender == "select" && isAttender == 0)
                        throw "Not belong as attender";
                    //Check if the attender already timed-in and does not yet timed-out
                    //Only allow time-in when the attender has not timed-in yet or it has no pending time-out
                    const hasPendingTimeOut = (yield connection.query("SELECT * FROM detailed_attendance WHERE entry_uid = ? AND member_uid = ? AND time_out IS NULL", [entry.entryUID, entry.memberUID]))[0].length;
                    if (hasPendingTimeOut)
                        throw "HAS PENDING TIME-OUT";
                    yield connection.query("INSERT INTO detailed_attendance (entry_uid, member_uid, entry_session, time_in, time_out) VALUES(?, ?, ?, ?, NULL)", [entry.entryUID, entry.memberUID, entry.session, entry.timeIn]);
                    //get profile
                    const profile = ((yield connection.query(`
                SELECT m.member_uid AS memberUID, a.avatar AS picture, CONCAT_WS(' ', fn.first_name, LEFT(fn.middle_name, 1), ". ", fn.surname, fn.ext_name) AS name
                FROM members AS m
                JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
                JOIN full_name AS fn ON mpi.full_name = fn.id
                LEFT JOIN avatar AS a ON m.avatar = a.id
                WHERE m.member_uid = ?
                
                LIMIT 1
                `, [entry.memberUID]))[0][0]);
                    //Commit 
                    connection.commit();
                    connection.release();
                    resolve({ querySuccess: true, profile: profile });
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
exports.default = addTimeIn;
