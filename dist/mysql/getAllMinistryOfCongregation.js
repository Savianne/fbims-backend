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
function getAllMinistryOfCongregation(congregation) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            const getAllMinistryOfCongregationQuery = `
        SELECT cm.ministry_uid AS ministryUID, a.avatar, mi.description, mi.ministry_name AS ministryName
        FROM congregation_ministry AS cm
        JOIN ministry AS m ON cm.ministry_uid = m.ministry_uid
        JOIN ministry_info AS mi ON m.ministry_info = mi.id
        LEFT JOIN avatar AS a ON m.avatar = a.id
        WHERE cm.congregation_uid = ?`;
            promisePool.query(getAllMinistryOfCongregationQuery, [congregation])
                .then(result => {
                const data = result[0];
                resolve({ success: true, data: data });
            })
                .catch(err => {
                console.log(err);
                reject({ success: false, error: err });
            });
        });
    });
}
exports.default = getAllMinistryOfCongregation;
