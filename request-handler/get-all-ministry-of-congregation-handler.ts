import { Request, Response } from "express";
import { IUserRequest } from "../types/IUserRequest";

import getAllMinistryOfCongregation from "../mysql/getAllMinistryOfCongregation";

const getAllMinistryOfCongregationHandler = async (req: Request, res:Response) => {
    const userRequest = req as IUserRequest;

    try {
        const result = await getAllMinistryOfCongregation(userRequest.user?.congregation as string);
        res.json(result);
    }
    catch(err) {
        console.log(err)
        res.json(err);
    }

}

export default getAllMinistryOfCongregationHandler;