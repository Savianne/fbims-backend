import { Request, Response } from "express";
import { IQueryPromise } from "../mysql/IQueryPromise";
import removeOrganizationMember from "../mysql/removeOrganizationMember";

const removeOrganizationMemberHandler = async (req: Request, res:Response) => {
    const dataPayload = req.body;
    try {
        const result = await removeOrganizationMember(dataPayload.memberUID, dataPayload.organizationUID);
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

export default removeOrganizationMemberHandler;