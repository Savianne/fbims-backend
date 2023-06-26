import { Request, Response } from "express";
import { IUserRequest } from "../types/IUserRequest";

import getOrganizationInfo from "../mysql/getOrganizationInfo";

const getOrganizationInfoHandler = async (req: Request, res:Response) => {
    const orgUID = req.body.data;
    
    try {
        const result = await getOrganizationInfo(orgUID)
        console.log(result)
        res.json(result);
    }
    catch(err) {
        res.json(err);
    }

}

export default getOrganizationInfoHandler;