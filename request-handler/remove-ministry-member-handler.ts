import { Request, Response } from "express";
import { IQueryPromise } from "../mysql/IQueryPromise";
import removeMinistryMember from "../mysql/removeMinistryMember";

const removeMinistryMemberHandler = async (req: Request, res:Response) => {
    const dataPayload = req.body;
    try {
        const result = await removeMinistryMember(dataPayload.memberUID, dataPayload.ministryUID);
        if(result.querySuccess) {
            res.json({success: true});
        } else throw result;
    }
    catch(err) {
        const e = err as IQueryPromise;
        res.json({
            success: false,
            error: e.error
        });
    }

}

export default removeMinistryMemberHandler;