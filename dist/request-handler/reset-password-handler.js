"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const handleResetPassword = (req, res) => {
    const token = req.params.token;
    if (!token)
        return res.status(401).send("Unauthorized!");
    const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
    jsonwebtoken_1.default.verify(token, access_token_secret, (error, decoded) => {
        if (error) {
            return res.status(401).send("Unauthorized!");
        }
        if (decoded) {
            res.cookie('rpAccount', token);
            res.sendFile(path_1.default.join(__dirname, '../../views/reset-password/index.html'));
        }
        else {
            res.status(401).send("Unauthorized!");
        }
    });
};
exports.default = handleResetPassword;
