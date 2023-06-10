"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addMemberRecord = (req, res) => {
    var _a, _b;
    const request = req;
    const adminUID = (_a = request.user) === null || _a === void 0 ? void 0 : _a.UID;
    const congregationUID = (_b = request.user) === null || _b === void 0 ? void 0 : _b.congregation;
};
exports.default = addMemberRecord;
