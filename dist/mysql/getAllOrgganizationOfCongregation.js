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
function getAllOrganizationOfCongregation(congregation) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            const getAllOrganizationOfCongregationQuery = `
        SELECT co.organization_uid AS organizationUID, a.avatar, oi.description, oi.organization_name AS organizationName
        FROM congregation_organizations AS co
        JOIN organizations AS o ON co.organization_uid = o.organization_uid
        JOIN organization_info AS oi ON o.organization_info = oi.id
        LEFT JOIN avatar AS a ON o.avatar = a.id
        WHERE co.congregation_uid = ?`;
            promisePool.query(getAllOrganizationOfCongregationQuery, [congregation])
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
exports.default = getAllOrganizationOfCongregation;
