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
const getMinistryInfo_1 = __importDefault(require("../mysql/getMinistryInfo"));
const getMinistryInfoHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ministryUID = req.body.data;
    try {
        const result = yield (0, getMinistryInfo_1.default)(ministryUID);
        res.json(result);
    }
    catch (err) {
        res.json(err);
    }
});
exports.default = getMinistryInfoHandler;
