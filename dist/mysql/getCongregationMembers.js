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
function getCongregationMembers(congregation, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            const query = `
            SELECT fn.first_name, fn.middle_name,  fn.surname, fn.ext_name, m.member_uid, aa.account_name AS added_by, cm.created_time AS creation_time, a.avatar
            FROM congregation_members AS cm
                JOIN members AS m ON cm.member_uid = m.member_uid
                JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
                JOIN full_name AS fn ON mpi.full_name = fn.id
                LEFT JOIN avatar AS a ON m.avatar = a.id
                LEFT JOIN admin_account AS aa ON aa.account_uid = cm.created_by
            WHERE cm.congregation_uid = ? 
            ORDER BY fn.first_name ${payload.sorting == "A-Z" ? "ASC" : "DESC"}
            LIMIT ?, ?
        `;
            promisePool.query(query, [congregation, ((payload.limit * payload.page) - payload.limit), payload.limit])
                .then(res => {
                const list = res[0];
                resolve({ querySuccess: true, result: list });
            })
                .catch(err => {
                console.log(err);
                reject({ querySuccess: false, error: err });
            });
        });
    });
}
;
exports.default = getCongregationMembers;
