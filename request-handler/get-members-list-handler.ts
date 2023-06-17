import { Request, Response } from "express";
import { IUserRequest } from "../types/IUserRequest";

import getCongregationMembers from "../mysql/getCongregationMembers";

const getCongregationMembersHandler = async (req: Request, res:Response) => {
    const userRequest = req as IUserRequest;

    try {
        const result = await getCongregationMembers(userRequest.user?.congregation as string, req.body);
        res.json(result);
    }
    catch(err) {
        res.json(err);
    }

}

export default getCongregationMembersHandler;