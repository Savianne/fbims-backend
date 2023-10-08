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
const updateMemberBasicInfo_1 = __importDefault(require("../mysql/updateMemberBasicInfo"));
const updateCurrentAddress_1 = __importDefault(require("../mysql/updateCurrentAddress"));
const updatePermanentAddress_1 = __importDefault(require("../mysql/updatePermanentAddress"));
const updateContactInfo_1 = __importDefault(require("../mysql/updateContactInfo"));
const updateMemberDataHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = req.params.category;
    const memberUID = req.params.memberUID;
    const updateData = req.body;
    switch (category) {
        case "basic-info":
            try {
                const result = yield (0, updateMemberBasicInfo_1.default)(memberUID, updateData);
                if (result.querySuccess) {
                    res.json({ success: true });
                }
                else
                    throw "No changes has made";
            }
            catch (err) {
                res.json({ success: false, error: err });
            }
            break;
        case "address":
            if (updateData.label == "current") {
                try {
                    const result = yield (0, updateCurrentAddress_1.default)(memberUID, updateData);
                    if (result.querySuccess) {
                        res.json({ success: true });
                    }
                    else
                        throw "No changes has made";
                }
                catch (err) {
                    res.json({ success: false, error: err });
                }
            }
            else if (updateData.label == "permanent") {
                try {
                    const result = yield (0, updatePermanentAddress_1.default)(memberUID, updateData);
                    if (result.querySuccess) {
                        res.json({ success: true });
                    }
                    else
                        throw "No changes has made";
                }
                catch (err) {
                    res.json({ success: false, error: err });
                }
            }
            break;
        case "contact":
            try {
                const result = yield (0, updateContactInfo_1.default)(memberUID, updateData);
                if (result.querySuccess) {
                    res.json({ success: true });
                }
                else
                    throw "No changes has made";
            }
            catch (err) {
                console.log(err);
                res.json({ success: false, error: err });
            }
    }
});
exports.default = updateMemberDataHandler;
