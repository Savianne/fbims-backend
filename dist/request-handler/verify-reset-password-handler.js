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
const bcrypt_1 = __importDefault(require("bcrypt"));
const restUserPassword_1 = __importDefault(require("../mysql/restUserPassword"));
const verifyResetPasswordHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    const email = req.body.email;
    const validate = (function validatePassword(password) {
        const regex = /^(?=.*[A-Z])(?=.*\d).*$/;
        if (password.length < 8) {
            return "Password Must be 8 characters long";
        }
        if (!regex.test(password)) {
            return "Password Must must have atleast 1 numeric and atleas 1 uppercase letter";
        }
        return null;
    })(password);
    if (validate) {
        return res.json({ changePassSuccess: false, error: validate });
    }
    else {
        const newHashedPassword = yield bcrypt_1.default.hash(password, 10);
        const resetPassResponse = yield (0, restUserPassword_1.default)(email, newHashedPassword);
        if (resetPassResponse && resetPassResponse.affectedRows > 0) {
            return res.json({ changePassSuccess: true });
        }
        return res.json({ changePassSuccess: false, error: "Query Error!" });
    }
});
exports.default = verifyResetPasswordHandler;
