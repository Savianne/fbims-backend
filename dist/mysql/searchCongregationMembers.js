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
function searchCongregationMembers(congregation, searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            const searchMemberQuery = `
        SELECT m.member_uid AS memberUID, a.avatar, CONCAT_WS(' ', fn.first_name, fn.middle_name, fn.surname, fn.ext_name) AS name
        FROM congregation_members AS cm
        JOIN members AS m ON cm.member_uid = m.member_uid AND cm.congregation_uid = ?
        JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
        JOIN full_name AS fn ON mpi.full_name = fn.id
        LEFT JOIN avatar AS a ON m.avatar = a.id
        WHERE CONCAT_WS(' ', fn.first_name, fn.middle_name, fn.surname, fn.ext_name) LIKE ?
        LIMIT 10`;
            promisePool.query(searchMemberQuery, [congregation, `%${searchTerm}%`])
                .then(result => {
                const data = result;
                resolve({ success: true, data: data[0] });
            })
                .catch(err => {
                console.log(err);
                reject({ success: false, error: err });
            });
        });
    });
}
exports.default = searchCongregationMembers;
