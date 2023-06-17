import { Request, Response } from "express";
import { io } from "..";

import deleteMemberRecordTransactionPromise from "../mysql/deleteMemberRecordTransaction";

const deleteMemberRecordHandler = async (req: Request, res:Response) => {
    const memberUID = req.body.data.memberUID;

    try {
        const result = await deleteMemberRecordTransactionPromise(memberUID);
        if(result.querySuccess) {
            io.emit('DELETED_MEMBER_RECORD');
            res.json({success: true});
        } else throw result;
    }
    catch(err) {
        res.json({
            success: false,
            error: ""
        });
    }

}

export default deleteMemberRecordHandler;