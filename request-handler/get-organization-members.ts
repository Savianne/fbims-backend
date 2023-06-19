import { Request, Response } from "express";
import { IUserRequest } from "../types/IUserRequest";

import getOrganizationMembers from "../mysql/getOrganizationMembers";

const getOrganizationMembersHandler = async (req: Request, res:Response) => {
    const organizationUID = req.body.data.organizationUID;
    
    try {
        const result = await getOrganizationMembers(organizationUID);
        res.json(result);
    }
    catch(err) {
        console.log(err)
        res.json(err);
    }

}

export default getOrganizationMembersHandler;