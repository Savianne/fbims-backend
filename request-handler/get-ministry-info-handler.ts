import { Request, Response } from "express";
import { IUserRequest } from "../types/IUserRequest";

import getMinistryInfo from "../mysql/getMinistryInfo";

const getMinistryInfoHandler = async (req: Request, res:Response) => {
    const ministryUID = req.body.data;
    
    try {
        const result = await getMinistryInfo(ministryUID);
        res.json(result);
    }
    catch(err) {
        res.json(err);
    }

}

export default getMinistryInfoHandler;