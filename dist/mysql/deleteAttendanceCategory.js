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
function deleteAttendanceCategory(categoryUID) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            promisePool.getConnection()
                .then(connection => {
                connection.beginTransaction()
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    //check if the category has entry
                    //if true cancel delete by throwing error
                    //else continue detetion
                    const hasEntries = (yield connection.query(`
                SELECT COUNT(*) AS totalEntries
                FROM attendance_entries AS ae
                WHERE ae.category_uid = ?`, [categoryUID]))[0][0].totalEntries;
                    if (hasEntries)
                        throw "Cannot delete category that has entries";
                    //Delete attendance category query
                    connection.query(`DELETE FROM attendance_categories WHERE uid = ?`, [categoryUID]);
                    //Delete category attenders query
                    connection.query(`DELETE FROM attendance_category_attenders WHERE category_id = ?`, [categoryUID]);
                    //Delete relation from congregation_attendance_category
                    connection.query(`DELETE FROM congregation_attendance_category WHERE category_uid = ?`, [categoryUID]);
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
exports.default = deleteAttendanceCategory;
