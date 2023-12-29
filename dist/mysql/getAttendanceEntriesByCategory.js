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
function getAttendanceEntriesByCategory(congregationUID, categoryUID, lastSelectedIndex, dateRangeFilter) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            promisePool.getConnection()
                .then(connection => {
                connection.beginTransaction()
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    //get total row
                    const totalRow = dateRangeFilter ?
                        (yield connection.query(`
                    SELECT COUNT(ae.id) as total
                    FROM attendance_entries AS ae
                    JOIN attendance_categories AS ac ON ae.category_uid = ac.uid
                    LEFT JOIN pending_attendance_entries AS pae ON ae.entry_uid = pae.entry_uid
                    LEFT JOIN submitted_attendance_entries AS sae ON ae.entry_uid = sae.entry_uid
                    JOIN congregation_attendance_category AS cac ON ac.uid = cac.category_uid
                    WHERE cac.congregation_uid = ? AND ac.uid = ? AND ae.date >= ? AND ae.date <= ?
                `, [congregationUID, categoryUID, dateRangeFilter.from, dateRangeFilter.to]))[0][0].total :
                        (yield connection.query(`
                    SELECT COUNT(ae.id) as total
                    FROM attendance_entries AS ae
                    JOIN attendance_categories AS ac ON ae.category_uid = ac.uid
                    LEFT JOIN pending_attendance_entries AS pae ON ae.entry_uid = pae.entry_uid
                    LEFT JOIN submitted_attendance_entries AS sae ON ae.entry_uid = sae.entry_uid
                    JOIN congregation_attendance_category AS cac ON ac.uid = cac.category_uid
                    WHERE cac.congregation_uid = ? AND ac.uid = ?
                `, [congregationUID, categoryUID]))[0][0].total;
                    const result = dateRangeFilter ? ((yield connection.query(`
                    SELECT 
                        CASE 
                            WHEN pae.entry_uid IS NOT NULL THEN true
                            ELSE false
                        END as pending,
                        CASE 
                            WHEN sae.entry_uid IS NOT NULL THEN true
                            ELSE false
                        END as saved,
                        ae.entry_uid AS entryUID, 
                        ac.uid AS categoryUID, 
                        ac.title AS categoryTitle, 
                        ac.type, 
                        ac.attender, 
                        ae.description, 
                        ae.date
                    FROM attendance_entries AS ae
                    JOIN attendance_categories AS ac ON ae.category_uid = ac.uid
                    LEFT JOIN pending_attendance_entries AS pae ON ae.entry_uid = pae.entry_uid
                    LEFT JOIN submitted_attendance_entries AS sae ON ae.entry_uid = sae.entry_uid
                    JOIN congregation_attendance_category AS cac ON ac.uid = cac.category_uid
                    WHERE cac.congregation_uid = ? AND ac.uid = ? AND ae.date >= ? AND ae.date <= ?
                    LIMIT ?, ?
                `, [congregationUID, categoryUID, dateRangeFilter.from, dateRangeFilter.to, +lastSelectedIndex || 0, 10]))[0]) :
                        ((yield connection.query(`
                    SELECT 
                        CASE 
                            WHEN pae.entry_uid IS NOT NULL THEN true
                            ELSE false
                        END as pending,
                        CASE 
                            WHEN sae.entry_uid IS NOT NULL THEN true
                            ELSE false
                        END as saved,
                        ae.entry_uid AS entryUID, 
                        ac.uid AS categoryUID, 
                        ac.title AS categoryTitle, 
                        ac.type, 
                        ac.attender, 
                        ae.description, 
                        ae.date
                    FROM attendance_entries AS ae
                    JOIN attendance_categories AS ac ON ae.category_uid = ac.uid
                    LEFT JOIN pending_attendance_entries AS pae ON ae.entry_uid = pae.entry_uid
                    LEFT JOIN submitted_attendance_entries AS sae ON ae.entry_uid = sae.entry_uid
                    JOIN congregation_attendance_category AS cac ON ac.uid = cac.category_uid
                    WHERE cac.congregation_uid = ? AND ac.uid = ?
                    LIMIT ?, ?
                `, [congregationUID, categoryUID, +lastSelectedIndex || 0, 10]))[0]);
                    //Commit 
                    connection.commit();
                    connection.release();
                    resolve({ querySuccess: true, data: {
                            total: totalRow,
                            entries: result
                        } });
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
exports.default = getAttendanceEntriesByCategory;
