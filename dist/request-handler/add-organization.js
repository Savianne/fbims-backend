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
const fs_extra_1 = __importDefault(require("fs-extra"));
const __1 = require("..");
const path_1 = __importDefault(require("path"));
const addOrganizationTransaction_1 = __importDefault(require("../mysql/addOrganizationTransaction"));
// import { TMinistryData } from "../mysql/addMinistryTransaction";
// import addMinistryTransactionPromise from "../mysql/addMinistryTransaction";
const addOrganizationHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const reqData = req.body.data;
    try {
        const result = yield (0, addOrganizationTransaction_1.default)({ congregation: user === null || user === void 0 ? void 0 : user.congregation, adminUID: user === null || user === void 0 ? void 0 : user.UID }, reqData);
        if (result.querySuccess) {
            if (reqData.avatar) {
                fs_extra_1.default.move(path_1.default.join(__dirname, "../../", "tmp-upload", reqData.avatar), path_1.default.join(__dirname, "../../", "public/assets/images/avatar", reqData.avatar), err => {
                    if (err) {
                        console.log(err);
                    }
                    __1.io.emit('ADDED_NEW_ORGANIZATION');
                    res.json({ success: true });
                });
            }
            else {
                __1.io.emit('ADDED_NEW_ORGANIZATION');
                res.json({ success: true });
            }
        }
        else
            throw result;
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
});
exports.default = addOrganizationHandler;
