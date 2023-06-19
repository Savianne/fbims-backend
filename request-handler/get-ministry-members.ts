import { Request, Response } from "express";
import { IUserRequest } from "../types/IUserRequest";

import getMinistryMembers from "../mysql/getMinistryMembers";

const getMinistryMembersHandler = async (req: Request, res:Response) => {
    const ministryUID = req.body.data.ministryUID;
    
    try {
        const result = await getMinistryMembers(ministryUID);
        res.json(result);
    }
    catch(err) {
        console.log(err)
        res.json(err);
    }

}

export default getMinistryMembersHandler;