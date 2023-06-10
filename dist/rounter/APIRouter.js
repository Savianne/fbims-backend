"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const add_member_record_handler_1 = __importDefault(require("../request-handler/add-member-record-handler"));
const APIRouter = express_1.default.Router();
APIRouter.use((req, res, next) => {
    const request = req;
    if (!request.user) {
        return res.status(401).json({
            error: "Unautorized Request!"
        });
    }
    else
        next();
});
APIRouter.post('/get-admin-info', (req, res) => {
    const request = req;
    res.json(request.user);
});
APIRouter.post('/add-membre-record', add_member_record_handler_1.default);
exports.default = APIRouter;
