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
const path_1 = __importDefault(require("path"));
const addMemberRecordTransaction_1 = __importDefault(require("../mysql/addMemberRecordTransaction"));
const index_1 = require("../index");
const addMemberRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const request = req;
    const adminUID = (_a = request.user) === null || _a === void 0 ? void 0 : _a.UID;
    const congregationUID = (_b = request.user) === null || _b === void 0 ? void 0 : _b.congregation;
    (0, addMemberRecordTransaction_1.default)(req.body, { congregation: congregationUID, adminUID: adminUID })
        .then(result => {
        if (req.body.personalInformation.avatar) {
            fs_extra_1.default.move(path_1.default.join(__dirname, "../../", "tmp-upload", req.body.personalInformation.avatar), path_1.default.join(__dirname, "../../", "public/assets/images/avatar", req.body.personalInformation.avatar), err => {
                if (err) {
                    console.log(err);
                }
            });
        }
        index_1.io.emit(`${congregationUID}-NEW_MEMBERS_RECORD_ADDED`);
        res.json(result);
    })
        .catch(err => {
        console.log(err);
        res.json(err);
    });
});
exports.default = addMemberRecord;
