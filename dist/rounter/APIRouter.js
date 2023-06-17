"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const add_member_record_handler_1 = __importDefault(require("../request-handler/add-member-record-handler"));
const get_records_count_handler_1 = __importDefault(require("../request-handler/get-records-count-handler"));
const get_members_list_handler_1 = __importDefault(require("../request-handler/get-members-list-handler"));
const delete_member_record_handler_1 = __importDefault(require("../request-handler/delete-member-record-handler"));
const add_ministry_1 = __importDefault(require("../request-handler/add-ministry"));
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
APIRouter.post('/add-member-record', add_member_record_handler_1.default);
APIRouter.post("/get-records-count/:container", get_records_count_handler_1.default);
APIRouter.post("/get-members-list", get_members_list_handler_1.default);
APIRouter.post("/delete-member-record", delete_member_record_handler_1.default);
APIRouter.post("/add-ministry", add_ministry_1.default);
exports.default = APIRouter;
