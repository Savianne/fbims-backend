import { Request, Response } from "express";
import { IUserRequest } from "../types/IUserRequest";
import { generateMembersUID } from "../controller/generateUID";
import fs from "fs-extra";
import path from "path";
import addMemberRecordTransactionPromise from "../mysql/addMemberRecordTransactionPromisedBase";
import addMemberRecordTransaction from "../mysql/addMemberRecordTransaction";

import { io } from "../index";

const addMemberRecord = async (req: Request, res: Response) => {
    const request = req as IUserRequest
    const adminUID = request.user?.UID;
    const congregationUID = request.user?.congregation;

    addMemberRecordTransaction(req.body, {congregation: congregationUID as string, adminUID: adminUID as string})
    .then(result => {
        if(req.body.personalInformation.avatar) {
            fs.move(path.join(__dirname, "../../", "tmp-upload", req.body.personalInformation.avatar), path.join(__dirname, "../../", "public/assets/images/avatar", req.body.personalInformation.avatar), err => {
                if(err) {
                    console.log(err);
                }
            })
        } 

        io.emit('NEW_MEMBERS_RECORD_ADDED');
        res.json(result);
    })
    .catch(err => {
        console.log(err)
        res.json(err)
    })

}

export default addMemberRecord;