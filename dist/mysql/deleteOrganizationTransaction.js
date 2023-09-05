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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pool_1 = __importDefault(require("./pool"));
function deleteOrganizationTransactionPromise(organizationUID) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            promisePool.getConnection()
                .then(connection => {
                connection.beginTransaction()
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    //Get Organization Info id and avatar id query
                    const getIdsQ = "SELECT organization_info, avatar FROM organizations WHERE organization_uid = ?";
                    //Delete Organization info
                    const deletOrganizationInfoQ = "DELETE FROM organization_info WHERE id = ?";
                    //Delete Ministry avatar
                    const deleteOrganizationAvatarQ = "DELETE FROM avatar WHERE id = ?";
                    //Get avatar name
                    const getAvatarNameQ = "SELECT avatar from avatar WHERE id =  ?";
                    //Delete organization from organizations table
                    const deleteOrganizationQ = "DELETE FROM organizations WHERE organization_uid = ?";
                    //Delete from congregation_organizations table
                    const deleteCongregationOrganizationsQ = "DELETE FROM congregation_organizations WHERE organization_uid = ?";
                    //Delete from organization_members table
                    const deleteOrganizationMembersQ = "DELETE FROM organization_members WHERE organization_uid = ?";
                    const getRecordFKeysQResult = ((yield connection.query(getIdsQ, [organizationUID]))[0])[0];
                    //Delete Organization info
                    yield connection.query(deletOrganizationInfoQ, [getRecordFKeysQResult.organization_info]);
                    //Get avatar name 
                    const avatarName = getRecordFKeysQResult.avatar ? ((yield connection.query(getAvatarNameQ, [getRecordFKeysQResult.avatar]))[0])[0] : null;
                    //Delete ministry avatar 
                    getRecordFKeysQResult.avatar && (yield connection.query(deleteOrganizationAvatarQ, [getRecordFKeysQResult.avatar]));
                    //Delete avatar file
                    getRecordFKeysQResult.avatar && (() => {
                        const imagesFolder = path_1.default.join(__dirname, '../../public/assets/images/avatar');
                        const imageName = avatarName === null || avatarName === void 0 ? void 0 : avatarName.avatar;
                        const imagePath = path_1.default.join(imagesFolder, imageName);
                        try {
                            // Check if the image file exists
                            if (fs_1.default.existsSync(imagePath)) {
                                // Delete the image file
                                fs_1.default.unlinkSync(imagePath);
                            }
                            else {
                                console.log("Image not found");
                            }
                        }
                        catch (error) {
                            throw "Failed to delete image";
                        }
                    })();
                    //Delete Organization from ministry table
                    yield connection.query(deleteOrganizationQ, [organizationUID]);
                    //Delete from congregation_organizations table
                    yield connection.query(deleteCongregationOrganizationsQ, [organizationUID]);
                    //Delete from organization_members table
                    yield connection.query(deleteOrganizationMembersQ, [organizationUID]);
                    //Commit 
                    connection.commit();
                    connection.release();
                    resolve({ querySuccess: true });
                }))
                    .catch((beginTransactionError) => {
                    connection.rollback();
                    connection.release();
                    console.log(beginTransactionError);
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
exports.default = deleteOrganizationTransactionPromise;
