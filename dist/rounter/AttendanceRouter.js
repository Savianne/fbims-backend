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
const express_1 = __importDefault(require("express"));
const addAttendanceCategory_1 = __importDefault(require("../mysql/addAttendanceCategory"));
const getCongregationAttendanceCategories_1 = __importDefault(require("../mysql/getCongregationAttendanceCategories"));
const getAttendanceCategoryAttenders_1 = __importDefault(require("../mysql/getAttendanceCategoryAttenders"));
const deleteAttendanceCategory_1 = __importDefault(require("../mysql/deleteAttendanceCategory"));
const AttendanceRouter = express_1.default.Router();
AttendanceRouter.use((req, res, next) => {
    const request = req;
    if (!request.user) {
        return res.status(401).json({
            error: "Unautorized Request!"
        });
    }
    else
        next();
});
AttendanceRouter.post('/add-attendance-category', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = req.body;
    const request = req;
    try {
        const result = yield (0, addAttendanceCategory_1.default)((_a = request.user) === null || _a === void 0 ? void 0 : _a.congregation, data);
        if (result.querySuccess) {
            res.json({
                success: true,
                data: result.uid
            });
        }
        else
            throw result.error;
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
AttendanceRouter.get("/congregation-attendance-categoty", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const request = req;
    try {
        const result = yield (0, getCongregationAttendanceCategories_1.default)((_b = request.user) === null || _b === void 0 ? void 0 : _b.congregation);
        if (result.querySuccess) {
            res.json({
                success: true,
                data: result.data
            });
        }
        else
            throw result.error;
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
AttendanceRouter.get("/attendance-categoty-attenders/:uid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.params.uid;
    try {
        const result = yield (0, getAttendanceCategoryAttenders_1.default)(uid);
        if (result.querySuccess) {
            res.json({
                success: true,
                data: result.data
            });
        }
        else
            throw result.error;
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
AttendanceRouter.delete("/delete-attendance-category/:uid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.params.uid;
    try {
        const result = yield (0, deleteAttendanceCategory_1.default)(uid);
        if (result.querySuccess) {
            res.json({
                success: true
            });
        }
        else
            throw result.error;
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
exports.default = AttendanceRouter;
