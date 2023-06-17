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
const getRecordsCount_1 = __importDefault(require("../mysql/getRecordsCount"));
const getRecordsCountHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userRequest = req;
    const table = req.params.container;
    switch (table) {
        case "members":
            (0, getRecordsCount_1.default)("members", (_a = userRequest.user) === null || _a === void 0 ? void 0 : _a.congregation)
                .then(result => {
                res.json(result);
            })
                .catch(err => res.json(err));
    }
});
exports.default = getRecordsCountHandler;
