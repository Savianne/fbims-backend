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
function getCategoryTotalEntries(categoryUID) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            const getCategoryEntriesQuery = `
        SELECT COUNT(*) AS totalEntries
        FROM attendance_entries AS ae
        WHERE ae.category_uid = ?`;
            promisePool.query(getCategoryEntriesQuery, [categoryUID])
                .then(result => {
                const totalEntries = result[0][0].totalEntries;
                resolve({ success: true, totalEntries: totalEntries });
            })
                .catch(err => {
                reject({ success: false, error: err });
            });
        });
    });
}
exports.default = getCategoryTotalEntries;
