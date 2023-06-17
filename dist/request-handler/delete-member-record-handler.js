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
const __1 = require("..");
const deleteMemberRecordTransaction_1 = __importDefault(require("../mysql/deleteMemberRecordTransaction"));
const deleteMemberRecordHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const memberUID = req.body.data.memberUID;
    try {
        const result = yield (0, deleteMemberRecordTransaction_1.default)(memberUID);
        if (result.querySuccess) {
            __1.io.emit('DELETED_MEMBER_RECORD');
            res.json({ success: true });
        }
        else
            throw result;
    }
    catch (err) {
        res.json({
            success: false,
            error: ""
        });
    }
});
exports.default = deleteMemberRecordHandler;
