import { Request, Response } from "express";
import { IUserRequest } from "../types/IUserRequest";
import { generateMembersUID } from "../controller/generateUID";

import addMemberRecordTransactionPromise from "../mysql/addMemberRecordTransactionPromisedBase";
import addMemberRecordTransaction from "../mysql/addMemberRecordTransaction";

import { io } from "../index";

const addMemberRecord = async (req: Request, res: Response) => {
    const request = req as IUserRequest
    const adminUID = request.user?.UID;
    const congregationUID = request.user?.congregation;

    addMemberRecordTransaction(req.body, {congregation: congregationUID as string, adminUID: adminUID as string})
    .then(result => {
        io.emit('NEW_MEMBERS_RECORD_ADDED');
        res.json(result);
    })
    .catch(err => {
        console.log(err)
        res.json(err)
    })

}

export default addMemberRecord;