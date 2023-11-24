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
const generateUID_1 = require("../controller/generateUID");
function addAttendanceEntry(entryData) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            promisePool.getConnection()
                .then(connection => {
                connection.beginTransaction()
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    const entryUID = (0, generateUID_1.generateUID)();
                    yield connection.query(`INSERT INTO attendance_entries (entry_uid, description, date, category_uid) VALUES(?, ?, ?, ?)`, [entryUID, entryData.description, entryData.entryDate, entryData.categoryUID]);
                    yield connection.query(`INSERT INTO pending_attendance_entries (entry_uid) VALUES(?)`, [entryUID]);
                    yield connection.query(`INSERT INTO entry_session (session, entry_uid, description) VALUES(?, ?, ?)`, [1, entryUID, "First session"]);
                    //Commit 
                    connection.commit();
                    connection.release();
                    resolve({ querySuccess: true, entryUID: entryUID });
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
exports.default = addAttendanceEntry;
