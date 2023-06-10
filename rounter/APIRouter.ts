import express, { RequestHandler } from 'express';

import { IUserRequest } from '../types/IUserRequest';

import addMemberRecord from '../request-handler/add-member-record-handler';

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

APIRouter.post('/add-membre-record', addMemberRecord);


export default APIRouter;