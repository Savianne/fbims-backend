import { Request, Response } from "express";
import { io } from "..";
import addMemberToOrganization from "../mysql/addMemberToOrganization";
import { IUserRequest } from "../types/IUserRequest";

const addMemberToOrganizationHandler = async (req: Request, res:Response) => {
    const user = (req as IUserRequest).user
   const organizationUID = req.body.organizationUID;
   const memberUID = req.body.memberUID;

    try {
        const result = await addMemberToOrganization(organizationUID, memberUID);if(result.success) {
            io.emit(`${user?.congregation}-ADDED_NEW_ORGANIZATION_MEMBER_TO${organizationUID}`)
        }
        res.json(result)
    }
    catch(err) {
        res.json(err);
    }

}

export default addMemberToOrganizationHandler;