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
function addCategoryTransactionPromise(congregation, categoryData) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => {
            promisePool.getConnection()
                .then(connection => {
                connection.beginTransaction()
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    const UID = (0, generateUID_1.generateUID)();
                    //Insery category and get the insert Id
                    yield connection.query("INSERT INTO attendance_categories (uid, title, attender, type) VALUES(?, ?, ?, ?)", [UID, categoryData.title, categoryData.attender, categoryData.type]);
                    //Insert attenders if the attender is select
                    categoryData.attender == "select" && (yield (() => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        for (let n = 0; n < ((_a = categoryData.attenders) === null || _a === void 0 ? void 0 : _a.length); n++) {
                            yield connection.query("INSERT INTO attendance_category_attenders (member_uid, category_id) VALUES(?, ?)", [categoryData.attenders[n], UID]);
                        }
                    }))());
                    //Insert to congregation_attendance_category
                    yield connection.query("INSERT INTO congregation_attendance_category (congregation_uid, category_uid) VALUES(?, ?)", [congregation, UID]);
                    //Commit 
                    connection.commit();
                    connection.release();
                    resolve({ querySuccess: true, uid: UID });
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
exports.default = addCategoryTransactionPromise;
