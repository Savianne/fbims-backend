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
function deleteMinistryTransactionPromise(ministryUID) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            promisePool.getConnection()
                .then(connection => {
                connection.beginTransaction()
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    //Get Ministry Info id and avatar id query
                    const getIdsQ = "SELECT ministry_info, avatar FROM ministry WHERE ministry_uid = ?";
                    //Delete Ministry info
                    const deleteMinistryInfoQ = "DELETE FROM ministry_info WHERE id = ?";
                    //Delete Ministry avatar
                    const deleteMinistryAvatarQ = "DELETE FROM avatar WHERE id = ?";
                    //Get avatar name
                    const getAvatarNameQ = "SELECT avatar from avatar WHERE id =  ?";
                    //Delete ministry from ministry table
                    const deleteMinistryQ = "DELETE FROM ministry WHERE ministry_uid = ?";
                    //Delete from congregation_ministry table
                    const deleteCongregationMinistryQ = "DELETE FROM congregation_ministry WHERE ministry_uid = ?";
                    //Delete from ministry_members table
                    const deleteMinistryMembersQ = "DELETE FROM ministry_members WHERE ministry_uid = ?";
                    const getRecordFKeysQResult = ((yield connection.query(getIdsQ, [ministryUID]))[0])[0];
                    console.log(getRecordFKeysQResult);
                    //Delete Ministry info
                    yield connection.query(deleteMinistryInfoQ, [getRecordFKeysQResult.ministry_info]);
                    //Get avatar name 
                    const avatarName = getRecordFKeysQResult.avatar ? ((yield connection.query(getAvatarNameQ, [getRecordFKeysQResult.avatar]))[0])[0] : null;
                    //Delete ministry avatar 
                    getRecordFKeysQResult.avatar && (yield connection.query(deleteMinistryAvatarQ, [getRecordFKeysQResult.avatar]));
                    //Delete avatar file
                    getRecordFKeysQResult.avatar && (() => {
                        const imagesFolder = path_1.default.join(__dirname, '../../public/assets/images/avatar');
                        const imageName = avatarName === null || avatarName === void 0 ? void 0 : avatarName.avatar;
                        const imagePath = path_1.default.join(imagesFolder, imageName);
                        console.log(imagePath);
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
                    //Delete Ministry from ministry table
                    yield connection.query(deleteMinistryQ, [ministryUID]);
                    //Delete from congregation_ministry table
                    yield connection.query(deleteCongregationMinistryQ, [ministryUID]);
                    //Delete from ministry_members table
                    yield connection.query(deleteMinistryMembersQ, [ministryUID]);
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
exports.default = deleteMinistryTransactionPromise;
