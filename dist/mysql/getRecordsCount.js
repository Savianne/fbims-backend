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
function getRecordsCount(table, congregation) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            const query = table == "members" ? "SELECT COUNT(*) AS total_count FROM congregation_members WHERE congregation_uid = ?" :
                table == "ministry" ? "SELECT COUNT(*) AS total_count FROM congregation_ministry WHERE congregation_uid = ?" :
                    table == "organizations" ? "SELECT COUNT(*) AS total_count FROM congregation_organizations WHERE congregation_uid = ?" : null;
            if (query) {
                promisePool.query(query, [congregation])
                    .then(res => {
                    const count = res[0][0];
                    resolve({ success: true, data: count });
                })
                    .catch(err => {
                    reject({ success: false, error: err });
                });
            }
            else {
                reject({ success: false, error: "No Query" });
            }
        });
    });
}
;
exports.default = getRecordsCount;
