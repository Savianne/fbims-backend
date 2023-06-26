import { Request, Response } from "express";
import { io } from "..";
import addMemberToOrganization from "../mysql/addMemberToOrganization";

const addMemberToOrganizationHandler = async (req: Request, res:Response) => {
   const organizationUID = req.body.organizationUID;
   const memberUID = req.body.memberUID;

    try {
        const result = await addMemberToOrganization(organizationUID, memberUID);if(result.success) {
            io.emit(`ADDED_NEW_ORGANIZATION_MEMBER_TO${organizationUID}`)
        }
        res.json(result)
    }
    catch(err) {
        res.json(err);
    }

}

export default addMemberToOrganizationHandler;