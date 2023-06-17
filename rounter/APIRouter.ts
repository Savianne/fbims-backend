import express, { RequestHandler } from 'express';

import { IUserRequest } from '../types/IUserRequest';

import addMemberRecord from '../request-handler/add-member-record-handler';
import getRecordsCountHandler from '../request-handler/get-records-count-handler';
import getCongregationMembersHandler from '../request-handler/get-members-list-handler';
import deleteMemberRecordHandler from '../request-handler/delete-member-record-handler';
import addMinistryHandler from '../request-handler/add-ministry';

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

export default APIRouter;