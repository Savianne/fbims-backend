import express, { RequestHandler } from 'express';

import { IUserRequest } from '../types/IUserRequest';

import addMemberRecord from '../request-handler/add-member-record-handler';
import getRecordsCountHandler from '../request-handler/get-records-count-handler';
import getCongregationMembersHandler from '../request-handler/get-members-list-handler';
import deleteMemberRecordHandler from '../request-handler/delete-member-record-handler';
import addMinistryHandler from '../request-handler/add-ministry';
import addOrganizationHandler from '../request-handler/add-organization';
import getAllMinistryOfCongregationHandler from '../request-handler/get-all-ministry-of-congregation-handler';
import getMinistryMembersHandler from '../request-handler/get-ministry-members';
import getAllOrganizationOfCongregationHandler from '../request-handler/geall-organization-of-congregation-handler';
import getOrganizationMembersHandler from '../request-handler/get-organization-members';
import getMinistryInfoHandler from '../request-handler/get-ministry-info-handler';
import getOrganizationInfoHandler from '../request-handler/get-organization-info';
import searchMemberForAddingMinistryMembersHandler from '../request-handler/search-members-for-ministry-membership-handler';
import searchMemberForAddingOrganizationMembersHandler from '../request-handler/search-members-for-adding-to-organization';
import addMemberToMinistryHandler from '../request-handler/addMemberToMinistryHandler';
import addMemberToOrganizationHandler from '../request-handler/addMemberToOrganizationHandler';

const APIRouter = express.Router();

APIRouter.use((req, res, next) => {
    const request = req as IUserRequest
    if(!request.user) {
        return res.status(401).json({
            error: "Unautorized Request!"
        })
    }
    else next()
});

APIRouter.post('/get-admin-info', (req, res) => {
    const request = req as IUserRequest;
    res.json(request.user);
});

APIRouter.post('/add-member-record', addMemberRecord);

APIRouter.post("/get-records-count/:container", getRecordsCountHandler);

APIRouter.post("/get-members-list", getCongregationMembersHandler)

APIRouter.post("/delete-member-record", deleteMemberRecordHandler)

APIRouter.post("/add-ministry", addMinistryHandler);

APIRouter.post("/add-organization", addOrganizationHandler);

APIRouter.post("/get-ministries", getAllMinistryOfCongregationHandler);

APIRouter.post('/get-organizations', getAllOrganizationOfCongregationHandler);

APIRouter.post("/get-ministry-members/", getMinistryMembersHandler);

APIRouter.post("/get-organization-member", getOrganizationMembersHandler);

APIRouter.post("/get-ministry-info", getMinistryInfoHandler);

APIRouter.post('/get-organization-info', getOrganizationInfoHandler);

APIRouter.post('/find-member', searchMemberForAddingMinistryMembersHandler);

APIRouter.post('/find-member-for-org', searchMemberForAddingOrganizationMembersHandler);

APIRouter.post('/add-member-to-ministry', addMemberToMinistryHandler)

APIRouter.post('/add-member-to-organization', addMemberToOrganizationHandler);

export default APIRouter;