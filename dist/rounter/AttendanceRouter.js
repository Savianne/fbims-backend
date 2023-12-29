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
const pool_1 = __importDefault(require("../mysql/pool"));
const __1 = require("..");
const addAttendanceCategory_1 = __importDefault(require("../mysql/addAttendanceCategory"));
const getCongregationAttendanceCategories_1 = __importDefault(require("../mysql/getCongregationAttendanceCategories"));
const getAttendanceCategoryAttenders_1 = __importDefault(require("../mysql/getAttendanceCategoryAttenders"));
const deleteAttendanceCategory_1 = __importDefault(require("../mysql/deleteAttendanceCategory"));
const addAttendanceEntry_1 = __importDefault(require("../mysql/addAttendanceEntry"));
const getCategoryTotalEntries_1 = __importDefault(require("../mysql/getCategoryTotalEntries"));
const getAttendanceCategoryByUid_1 = __importDefault(require("../mysql/getAttendanceCategoryByUid"));
const getAttendanceEntriesByCategory_1 = __importDefault(require("../mysql/getAttendanceEntriesByCategory"));
const addPresent_1 = __importDefault(require("../mysql/addPresent"));
const addTimeIn_1 = __importDefault(require("../mysql/addTimeIn"));
const addTimeOut_1 = __importDefault(require("../mysql/addTimeOut"));
const deleteAttendanceEntrySession_1 = __importDefault(require("../mysql/deleteAttendanceEntrySession"));
const savePendingEntry_1 = __importDefault(require("../mysql/savePendingEntry"));
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
AttendanceRouter.post("/add-attendance-category-attender/:categoryUID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryUID = req.params.categoryUID;
    const memberUID = req.body.memberUID;
    const promisePool = pool_1.default.promise();
    try {
        yield promisePool.query("INSERT INTO attendance_category_attenders (member_uid, category_id) VALUES(?, ?)", [memberUID, categoryUID]);
        res.json({
            success: true
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
AttendanceRouter.delete("/remove-category-attender/:categoryUID/:memberUID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryUID = req.params.categoryUID;
    const memberUID = req.params.memberUID;
    const promisePool = pool_1.default.promise();
    try {
        yield promisePool.query("DELETE FROM attendance_category_attenders WHERE member_uid = ? AND category_id = ?", [memberUID, categoryUID]);
        res.json({
            success: true
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
AttendanceRouter.get("/get-attendance-category/:uid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.params.uid;
    try {
        const result = yield (0, getAttendanceCategoryByUid_1.default)(uid);
        if (result.success) {
            res.json({
                success: true,
                data: result.result
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
AttendanceRouter.get("/congregation-attendance-category", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
AttendanceRouter.post('/add-attendance-entry', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const entryData = req.body;
    const request = req;
    const congregationUID = (_c = request.user) === null || _c === void 0 ? void 0 : _c.congregation;
    try {
        const result = yield (0, addAttendanceEntry_1.default)(entryData);
        if (result.querySuccess) {
            __1.io.emit(`${congregationUID}-ADDED_NEW_ATTENDANCE_ENTRY`, { entryUID: result.entryUID, category: entryData.categoryUID, id: new Date().getTime() });
            res.json({
                success: true,
                entryUID: result.entryUID
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
AttendanceRouter.get("/get-attendance-category-total-entries/:categoryUID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryUID = req.params.categoryUID;
    try {
        const result = yield (0, getCategoryTotalEntries_1.default)(categoryUID);
        res.json({
            success: true,
            data: result.totalEntries
        });
    }
    catch (err) {
        res.json(err);
    }
}));
AttendanceRouter.patch("/update-category-title/:categoryUID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryUID = req.params.categoryUID;
    const title = req.body.title;
    const promisePool = pool_1.default.promise();
    try {
        yield promisePool.query("UPDATE attendance_categories SET title = ? WHERE uid = ?", [title || null, categoryUID]);
        res.json({
            success: true
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
AttendanceRouter.patch("/update-entry-title/:entryUID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entryUID = req.params.entryUID;
    const title = req.body.title;
    const promisePool = pool_1.default.promise();
    try {
        yield promisePool.query("UPDATE attendance_entries SET description = ? WHERE entry_uid = ?", [title || null, entryUID]);
        res.json({
            success: true
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
AttendanceRouter.post("/add-entry-session/:entryUID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const entryUID = req.params.entryUID;
    const request = req;
    const congregationUID = (_d = request.user) === null || _d === void 0 ? void 0 : _d.congregation;
    const promisePool = pool_1.default.promise();
    try {
        const id = (yield promisePool.query("INSERT INTO entry_session (entry_uid) VALUES(?)", [entryUID]))[0].insertId;
        __1.io.emit(`${congregationUID}-ADDED_NEW_ATTENDANCE_ENTRY_SESSION-${entryUID}`);
        res.json({
            success: true,
            id: id
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
AttendanceRouter.get("/get-pending-attendance-entries/:index", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const request = req;
    const congregationUID = (_e = request.user) === null || _e === void 0 ? void 0 : _e.congregation;
    const index = req.params.index;
    const promisePool = pool_1.default.promise();
    try {
        const result = (yield promisePool.query(`
            SELECT 
                pae.entry_uid AS entryUID, 
                ac.uid AS categoryUID, 
                ac.title AS categoryTitle, 
                ac.type, 
                ac.attender, 
                ae.description, 
                ae.date
            FROM pending_attendance_entries AS pae
            JOIN attendance_entries AS ae ON pae.entry_uid = ae.entry_uid
            JOIN attendance_categories AS ac ON ae.category_uid = ac.uid
            JOIN congregation_attendance_category AS cac ON ac.uid = cac.category_uid
            WHERE cac.congregation_uid = ?
            LIMIT ?, ?
        `, [congregationUID, +index || 0, 5]))[0];
        res.json({
            data: result,
            success: true
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
AttendanceRouter.get("/get-total-pending-attendance-entries", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const request = req;
    const congregationUID = (_f = request.user) === null || _f === void 0 ? void 0 : _f.congregation;
    const promisePool = pool_1.default.promise();
    try {
        const rows = (yield promisePool.query(`
            SELECT 
                COUNT(*) AS total
            FROM pending_attendance_entries AS pae
            JOIN attendance_entries AS ae ON pae.entry_uid = ae.entry_uid
            JOIN attendance_categories AS ac ON ae.category_uid = ac.uid
            JOIN congregation_attendance_category AS cac ON ac.uid = cac.category_uid
            WHERE cac.congregation_uid = ?
        `, [congregationUID]))[0][0].total;
        res.json({
            data: rows,
            success: true
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
AttendanceRouter.get("/get-entry-sessions/:entryUID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entryUID = req.params.entryUID;
    const promisePool = pool_1.default.promise();
    try {
        const rows = (yield promisePool.query(`
            SELECT id FROM entry_session WHERE entry_uid = ?
        `, [entryUID]))[0];
        res.json({
            data: rows,
            success: true
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
AttendanceRouter.post("/get-attendance-entries-by-category/:categoryUID/:index", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const request = req;
    const congregationUID = (_g = request.user) === null || _g === void 0 ? void 0 : _g.congregation;
    const categoryUID = req.params.categoryUID;
    const index = req.params.index;
    const dateRangeFilter = req.body.dateRangeFilter;
    try {
        const result = yield (0, getAttendanceEntriesByCategory_1.default)(congregationUID, categoryUID, +index, dateRangeFilter);
        res.json({
            data: result.data,
            success: true
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
AttendanceRouter.get("/get-basic-attendance-present-attendees/:entryUID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entryUID = req.params.entryUID;
    const promisePool = pool_1.default.promise();
    try {
        const result = (yield promisePool.query(`
            SELECT ba.entry_session AS entrySession, ba.entry_uid AS entryUID, m.member_uid AS memberUID, a.avatar AS picture, CONCAT_WS(' ', fn.first_name, LEFT(fn.middle_name, 1), ". ", fn.surname, fn.ext_name) AS name
            FROM basic_attendance AS ba
            JOIN members AS m ON ba.member_uid = m.member_uid
            JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
            JOIN full_name AS fn ON mpi.full_name = fn.id
            LEFT JOIN avatar AS a ON m.avatar = a.id
            WHERE ba.entry_uid = ?
        `, [entryUID]))[0];
        res.json({
            data: result,
            success: true
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
AttendanceRouter.get("/get-detailed-attendance-attendees/:entryUID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entryUID = req.params.entryUID;
    const promisePool = pool_1.default.promise();
    try {
        const result = (yield promisePool.query(`
            SELECT da.id, da.entry_session AS entrySession, da.entry_uid AS entryUID, da.time_in AS timeIn, da.time_out AS timeOut, m.member_uid AS memberUID, a.avatar AS picture, CONCAT_WS(' ', fn.first_name, LEFT(fn.middle_name, 1), ". ", fn.surname, fn.ext_name) AS name
            FROM detailed_attendance AS da
            JOIN members AS m ON da.member_uid = m.member_uid
            JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
            JOIN full_name AS fn ON mpi.full_name = fn.id
            LEFT JOIN avatar AS a ON m.avatar = a.id
            WHERE da.entry_uid = ?
        `, [entryUID]))[0];
        res.json({
            data: result,
            success: true
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
AttendanceRouter.post('/add-present', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    const request = req;
    const congregationUID = (_h = request.user) === null || _h === void 0 ? void 0 : _h.congregation;
    const data = req.body;
    try {
        const result = yield (0, addPresent_1.default)(congregationUID, data.categoryUID, data);
        if (result.querySuccess) {
            __1.io.emit(`${congregationUID}-NEW_PRESENT_${data.entryUID}`, Object.assign(Object.assign({}, result.profile), { entrySession: data.session, entryUID: data.entryUID }));
            __1.io.emit(`${congregationUID}-NEW_PRESENT`, Object.assign(Object.assign({}, result.profile), { entrySession: data.session, entryUID: data.entryUID }));
            res.json({
                success: true,
            });
        }
        else
            throw result;
    }
    catch (err) {
        console.log(err);
        const queryError = err;
        res.json({
            success: false,
            error: queryError.error
        });
    }
}));
AttendanceRouter.post('/add-time-in', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    const request = req;
    const congregationUID = (_j = request.user) === null || _j === void 0 ? void 0 : _j.congregation;
    const data = req.body;
    try {
        const result = yield (0, addTimeIn_1.default)(congregationUID, data.categoryUID, data);
        if (result.querySuccess) {
            __1.io.emit(`${congregationUID}-NEW_TIMEIN_${data.entryUID}`, Object.assign(Object.assign({}, result.profile), { entrySession: data.session, entryUID: data.entryUID }));
            __1.io.emit(`${congregationUID}-NEW_TIMEIN`, Object.assign(Object.assign({}, result.profile), { entrySession: data.session, entryUID: data.entryUID }));
            res.json({
                success: true,
            });
        }
        else
            throw result;
    }
    catch (err) {
        console.log(err);
        const queryError = err;
        res.json({
            success: false,
            error: queryError.error
        });
    }
}));
AttendanceRouter.post('/add-time-out', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    const request = req;
    const congregationUID = (_k = request.user) === null || _k === void 0 ? void 0 : _k.congregation;
    const data = req.body;
    try {
        const result = yield (0, addTimeOut_1.default)(congregationUID, data.categoryUID, data);
        if (result.querySuccess) {
            __1.io.emit(`${congregationUID}-NEW_TIMEOUT_${data.entryUID}`, Object.assign(Object.assign({}, result.profile), { entrySession: data.session, entryUID: data.entryUID }));
            __1.io.emit(`${congregationUID}-NEW_TIMEOUT`, Object.assign(Object.assign({}, result.profile), { entrySession: data.session, entryUID: data.entryUID }));
            res.json({
                success: true,
            });
        }
        else
            throw result.error;
    }
    catch (err) {
        console.log(err);
        const queryError = err;
        res.json({
            success: false,
            error: queryError.error
        });
    }
}));
AttendanceRouter.delete('/remove-present/:entryUID/:memberUID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    const request = req;
    const congregationUID = (_l = request.user) === null || _l === void 0 ? void 0 : _l.congregation;
    const entryUID = req.params.entryUID;
    const memberUID = req.params.memberUID;
    const promisePool = pool_1.default.promise();
    try {
        yield promisePool.query("DELETE FROM basic_attendance WHERE entry_uid = ? AND member_uid = ?", [entryUID, memberUID]);
        __1.io.emit(`${congregationUID}-REMOVED_PRESENT_${entryUID}`);
        res.json({
            success: true
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
AttendanceRouter.delete('/remove-time-in-out/:entryUID/:memberUID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _m;
    const request = req;
    const congregationUID = (_m = request.user) === null || _m === void 0 ? void 0 : _m.congregation;
    const entryUID = req.params.entryUID;
    const memberUID = req.params.memberUID;
    const promisePool = pool_1.default.promise();
    try {
        yield promisePool.query("DELETE FROM detailed_attendance WHERE entry_uid = ? AND member_uid = ?", [entryUID, memberUID]);
        __1.io.emit(`${congregationUID}-REMOVED_TIMEINOUT_${entryUID}`);
        res.json({
            success: true
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
AttendanceRouter.delete('/delete-attendance-entry-session/:type/:entryUID/:session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _o;
    const request = req;
    const congregationUID = (_o = request.user) === null || _o === void 0 ? void 0 : _o.congregation;
    const entryUID = req.params.entryUID;
    const session = req.params.session;
    const type = req.params.type;
    try {
        const result = yield (0, deleteAttendanceEntrySession_1.default)(entryUID, type, +session);
        if (result.querySuccess) {
            __1.io.emit(`${congregationUID}-DELETED_ATTENDANCE_ENTRY_SESSION-${entryUID}`);
            res.json({
                success: true,
            });
        }
        else
            throw result.error;
    }
    catch (err) {
        const error = err;
        console.log(error.error);
        res.json({
            success: false,
            error: error.error
        });
    }
}));
AttendanceRouter.delete('/remove-time-in-out-by-id/:entryUID/:memberUID/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _p;
    const request = req;
    const congregationUID = (_p = request.user) === null || _p === void 0 ? void 0 : _p.congregation;
    const id = req.params.id;
    const entryUID = req.params.entryUID;
    const memberUID = req.params.memberUID;
    const promisePool = pool_1.default.promise();
    try {
        yield promisePool.query("DELETE FROM detailed_attendance WHERE id = ? AND entry_uid = ? AND member_uid = ?", [id, entryUID, memberUID]);
        __1.io.emit(`${congregationUID}-REMOVED_TIMEINOUT_${entryUID}`);
        res.json({
            success: true,
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            error: err
        });
    }
}));
AttendanceRouter.post('/save-attendance-entry/:entryUID/:categoryUID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _q;
    const request = req;
    const congregationUID = (_q = request.user) === null || _q === void 0 ? void 0 : _q.congregation;
    const entryUID = req.params.entryUID;
    const categoryUID = req.params.categoryUID;
    try {
        const result = yield (0, savePendingEntry_1.default)(entryUID);
        if (result.querySuccess) {
            __1.io.emit(`${congregationUID}-ENTRY_SAVED`, { category: categoryUID });
            res.json({
                success: true,
            });
        }
        else
            throw result.error;
    }
    catch (err) {
        const error = err;
        console.log(error.error);
        res.json({
            success: false,
            error: error.error
        });
    }
}));
exports.default = AttendanceRouter;
