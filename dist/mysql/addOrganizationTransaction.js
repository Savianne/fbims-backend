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
function addOrganizatioTransactionPromise(adminInfo, orgData) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            promisePool.getConnection()
                .then(connection => {
                connection.beginTransaction()
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    const org_UID = (0, generateUID_1.generateUID)();
                    const addOrgInfoQ = "INSERT INTO organization_info (organization_name, description) VALUES (?, ?)";
                    const addAvatarQ = "INSERT INTO avatar (avatar) VALUES (?)";
                    const createOrgQ = "INSERT INTO organizations (organization_uid, organization_info, avatar) VALUES (?, ?, ?)";
                    const addOrganizationToCongregation = "INSERT INTO congregation_organizations (congregation_uid, organization_uid, created_by) VALUES (?, ?, ?)";
                    const [organizationInfoQResult] = yield connection.query(addOrgInfoQ, [orgData.name, orgData.description]);
                    const organizationInfoID = organizationInfoQResult.insertId;
                    const [avatarQResult] = orgData.avatar ? yield connection.query(addAvatarQ, [orgData.avatar]) : [null];
                    const avatarID = orgData.avatar ? avatarQResult.insertId : null;
                    yield connection.query(createOrgQ, [org_UID, organizationInfoID, avatarID]);
                    yield connection.query(addOrganizationToCongregation, [adminInfo.congregation, org_UID, adminInfo.adminUID]);
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
exports.default = addOrganizatioTransactionPromise;
