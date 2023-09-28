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
const add_organization_1 = __importDefault(require("../request-handler/add-organization"));
const get_all_ministry_of_congregation_handler_1 = __importDefault(require("../request-handler/get-all-ministry-of-congregation-handler"));
const get_ministry_members_1 = __importDefault(require("../request-handler/get-ministry-members"));
const geall_organization_of_congregation_handler_1 = __importDefault(require("../request-handler/geall-organization-of-congregation-handler"));
const get_organization_members_1 = __importDefault(require("../request-handler/get-organization-members"));
const get_ministry_info_handler_1 = __importDefault(require("../request-handler/get-ministry-info-handler"));
const get_organization_info_1 = __importDefault(require("../request-handler/get-organization-info"));
const search_members_for_ministry_membership_handler_1 = __importDefault(require("../request-handler/search-members-for-ministry-membership-handler"));
const search_members_for_adding_to_organization_1 = __importDefault(require("../request-handler/search-members-for-adding-to-organization"));
const addMemberToMinistryHandler_1 = __importDefault(require("../request-handler/addMemberToMinistryHandler"));
const addMemberToOrganizationHandler_1 = __importDefault(require("../request-handler/addMemberToOrganizationHandler"));
const get_member_information_by_uid_1 = __importDefault(require("../request-handler/get-member-information-by-uid"));
const delete_ministry_handler_1 = __importDefault(require("../request-handler/delete-ministry-handler"));
const delete_organization_hnadler_1 = __importDefault(require("../request-handler/delete-organization-hnadler"));
const remove_ministry_member_handler_1 = __importDefault(require("../request-handler/remove-ministry-member-handler"));
const remove_organization_member_handler_1 = __importDefault(require("../request-handler/remove-organization-member-handler"));
const update_member_data_handler_1 = __importDefault(require("../request-handler/update-member-data-handler"));
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
APIRouter.post("/add-organization", add_organization_1.default);
APIRouter.post("/get-ministries", get_all_ministry_of_congregation_handler_1.default);
APIRouter.post('/get-organizations', geall_organization_of_congregation_handler_1.default);
APIRouter.post("/get-ministry-members/", get_ministry_members_1.default);
APIRouter.post("/get-organization-member", get_organization_members_1.default);
APIRouter.post("/get-ministry-info", get_ministry_info_handler_1.default);
APIRouter.post('/get-organization-info', get_organization_info_1.default);
APIRouter.post('/find-member', search_members_for_ministry_membership_handler_1.default);
APIRouter.post('/find-member-for-org', search_members_for_adding_to_organization_1.default);
APIRouter.post('/add-member-to-ministry', addMemberToMinistryHandler_1.default);
APIRouter.post('/add-member-to-organization', addMemberToOrganizationHandler_1.default);
APIRouter.get('/get-members-record/:memberUID', get_member_information_by_uid_1.default);
APIRouter.delete('/delete-ministry/:ministryUID', delete_ministry_handler_1.default);
APIRouter.delete('/delete-organization/:organizationUID', delete_organization_hnadler_1.default);
APIRouter.delete('/remove-ministry-member', remove_ministry_member_handler_1.default);
APIRouter.delete('/remove-organization-member', remove_organization_member_handler_1.default);
APIRouter.patch('/update-member-data/:category/:memberUID', update_member_data_handler_1.default);
exports.default = APIRouter;
