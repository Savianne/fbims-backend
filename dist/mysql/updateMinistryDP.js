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
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const pool_1 = __importDefault(require("./pool"));
function updateMinistryDisplayPicture(ministryUID, updateData) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            promisePool.getConnection()
                .then(connection => {
                connection.beginTransaction()
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    //get the FKeys
                    const getFKey = ((yield connection.query(`
                SELECT avatar FROM ministry WHERE ministry_uid = ?
                `, [ministryUID]))[0])[0];
                    updateData.query == "remove" && (yield (() => __awaiter(this, void 0, void 0, function* () {
                        yield connection.query("DELETE FROM avatar WHERE id = ?", [getFKey.avatar]);
                        yield connection.query("UPDATE ministry SET avatar = NULL WHERE ministry_uid = ?", [ministryUID]);
                        const imagesFolder = path_1.default.join(__dirname, '../../public/assets/images/avatar');
                        const imageName = updateData.picture;
                        const imagePath = path_1.default.join(imagesFolder, imageName);
                        // Check if the image file exists and then delete
                        fs_1.default.existsSync(imagePath) && fs_1.default.unlinkSync(imagePath);
                    }))());
                    updateData.query == "update" && (yield (() => __awaiter(this, void 0, void 0, function* () {
                        yield fs_extra_1.default.move(path_1.default.join(__dirname, "../../", "tmp-upload", updateData.picture), path_1.default.join(__dirname, "../../", "public/assets/images/avatar", updateData.picture));
                        getFKey.avatar && (yield connection.query(`UPDATE avatar SET avatar = ? WHERE id = ?`, [updateData.picture, getFKey.avatar]));
                        const newFkey = getFKey.avatar == null ? (yield connection.query(`INSERT INTO avatar (avatar) VALUES(?)`, [updateData.picture]))[0].insertId : null;
                        newFkey && (yield connection.query(`UPDATE ministry SET avatar = ? WHERE ministry_uid = ?`, [newFkey, ministryUID]));
                    }))());
                    //Commit 
                    connection.commit();
                    connection.release();
                    resolve({ querySuccess: true });
                }))
                    .catch((beginTransactionError) => {
                    console.log("connection rolled back");
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
exports.default = updateMinistryDisplayPicture;
