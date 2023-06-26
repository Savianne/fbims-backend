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
function addMemberToMinistry(minstryUID, memberUID) {
    return __awaiter(this, void 0, void 0, function* () {
        const promisePool = pool_1.default.promise();
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const isExist = ((yield promisePool.query("SELECT COUNT(*) AS count FROM ministry_members WHERE ministry_uid = ? AND member_uid = ?", [minstryUID, memberUID]))[0][0]).count;
                if (isExist)
                    return reject({ success: false, error: "Duplicate Entry" });
                const addMemberToMinistryQuery = `INSERT INTO ministry_members (ministry_uid, member_uid) VALUES (?, ?)`;
                const isAdded = (yield promisePool.query(addMemberToMinistryQuery, [minstryUID, memberUID]))[0].affectedRows;
                isAdded ? resolve({ success: true }) : reject({ success: false, error: "Faild to Add" });
            }
            catch (err) {
                console.log(err);
                reject({ success: false, error: "Internal Server Error" });
            }
        }));
    });
}
exports.default = addMemberToMinistry;
