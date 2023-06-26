import { Request, Response } from "express";
import { io } from "..";
import addMemberToMinistry from "../mysql/addMemberToMinistry";

const addMemberToMinistryHandler = async (req: Request, res:Response) => {
   const ministryUID = req.body.ministryUID;
   const memberUID = req.body.memberUID;

    try {
        const result = await addMemberToMinistry(ministryUID, memberUID);
        if(result.success) {
            io.emit(`ADDED_NEW_MINISTRY_MEMBER_TO${ministryUID}`)
        }
        res.json(result)
    }
    catch(err) {
        res.json(err);
    }

}

export default addMemberToMinistryHandler;