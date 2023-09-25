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
const searchCongregationMemberForAddingToMinistry_1 = __importDefault(require("../mysql/searchCongregationMemberForAddingToMinistry"));
const searchMemberForAddingMinistryMembersHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const request = req;
    const congregationUID = (_a = request.user) === null || _a === void 0 ? void 0 : _a.congregation;
    const ministryUID = req.body.ministryUID;
    const searchTerm = req.body.searchTerm;
    (0, searchCongregationMemberForAddingToMinistry_1.default)(ministryUID, congregationUID, searchTerm)
        .then(result => {
        res.json(result);
    })
        .catch(err => {
        console.log(err);
        res.json(err);
    });
});
exports.default = searchMemberForAddingMinistryMembersHandler;