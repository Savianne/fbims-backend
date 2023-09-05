import { Request, Response } from "express";
import { IUserRequest } from "../types/IUserRequest";

import getMembersInfoByUID from "../mysql/getMembersInformationByUID";

const getMemberInfoByUIDHandler = async (req: Request, res:Response) => {
    const memberUID = req.params.memberUID;
    
    try {
        const result = await getMembersInfoByUID(memberUID);
        res.json({success: true, data: result.result});
    }
    catch(err) {
        res.json(err);
    }

}

export default getMemberInfoByUIDHandler;