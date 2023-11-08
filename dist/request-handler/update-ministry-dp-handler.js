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
const updateMinistryDP_1 = __importDefault(require("../mysql/updateMinistryDP"));
const updateMinistryDisplayPictureHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.params.query;
    const ministryUID = req.params.ministryUID;
    const picture = req.params.dp;
    try {
        const result = yield (0, updateMinistryDP_1.default)(ministryUID, { picture, query: query });
        if (result.querySuccess) {
            res.json({ success: true });
        }
        else
            throw "No changes has made";
    }
    catch (err) {
        res.json({ success: false, error: err });
    }
});
exports.default = updateMinistryDisplayPictureHandler;
