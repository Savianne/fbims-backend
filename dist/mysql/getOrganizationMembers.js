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
function getOrganizationMembers(organizationUID) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            const getAllMembersOfTheOrganizationQuery = `
        SELECT om.member_uid AS memberUID, fn.first_name AS firstName, fn.middle_name AS middleName, fn.surname, a.avatar,  mpi.gender, mpi.date_of_birth AS dateOfBirth
        FROM organization_members AS om
        JOIN organizations AS o ON om.organization_uid = o.organization_uid
        JOIN members AS m ON m.member_uid = om.member_uid
        JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
        JOIN full_name AS fn ON mpi.full_name = fn.id
        LEFT JOIN avatar AS a ON m.avatar = a.id
        WHERE om.organization_uid = ?
        `;
            promisePool.query(getAllMembersOfTheOrganizationQuery, [organizationUID])
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
exports.default = getOrganizationMembers;
