"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getResetPassAccount = (req, res) => {
    const resetPassAccountCookie = req.cookies.rpAccount;
    if (!resetPassAccountCookie)
        return res.status(401).send("No Reset Token FOund!");
    const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
    jsonwebtoken_1.default.verify(resetPassAccountCookie, access_token_secret, (error, decoded) => {
        if (error) {
            res.clearCookie('rpAccount');
            return res.status(401).send("Unauthorized!");
        }
        if (decoded) {
            const account = decoded;
            res.clearCookie('rpAccount');
            res.json(account);
        }
        else {
            res.clearCookie('rpAccount');
            res.status(401).send("Unauthorized!");
        }
    });
};
exports.default = getResetPassAccount;
