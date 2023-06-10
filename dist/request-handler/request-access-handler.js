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
const getUserAccountInfoByEmail_1 = __importDefault(require("../mysql/getUserAccountInfoByEmail"));
const getUserAccountByCPNumber_1 = __importDefault(require("../mysql/getUserAccountByCPNumber"));
const addRequestAccess_1 = __importDefault(require("../mysql/addRequestAccess"));
const handleRequestAccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqData = req.body;
    const emailExistInDb = (yield (0, getUserAccountInfoByEmail_1.default)(reqData.email)).length;
    if (emailExistInDb) {
        return res.json({ querySuccess: false, errorField: { feild: "email", errorInfo: { errorText: "Email Already Exist!", validationResult: [{ passed: false, caption: "Email Must be unique!" }] } } });
    }
    const numberExistInDb = (yield (0, getUserAccountByCPNumber_1.default)(reqData.cp_number)).length;
    if (numberExistInDb) {
        return res.json({ querySuccess: false, errorField: { feild: "cp_number", errorInfo: { errorText: "CP Number Already Exist!", validationResult: [{ passed: false, caption: "CP Number Must be unique!" }] } } });
    }
    (0, addRequestAccess_1.default)(reqData)
        .then(query => {
        if (query.affectedRows && query.affectedRows > 0) {
            return res.json({ querySuccess: true });
        }
        else {
            return res.json({ querySuccess: false, queryError: "Query Faild, Please try again!" });
        }
    })
        .catch((err) => {
        if (err.code == "ER_DUP_ENTRY") {
            return res.json({ querySuccess: false, queryError: "The Email or CP Number you provided was already exist in the Request Queue, You can only send as request once" });
        }
        else {
            return res.json({ querySuccess: false, queryError: "Query Faild, Please try again!" });
        }
    });
});
exports.default = handleRequestAccess;
