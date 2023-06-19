import { Request, Response } from "express";
import { IUserRequest } from "../types/IUserRequest";

import getAllOrganizationOfCongregation from "../mysql/getAllOrgganizationOfCongregation";

const getAllOrganizationOfCongregationHandler = async (req: Request, res:Response) => {
    const userRequest = req as IUserRequest;

    try {
        const result = await getAllOrganizationOfCongregation(userRequest.user?.congregation as string);
        res.json(result);
    }
    catch(err) {
        console.log(err)
        res.json(err);
    }

}

export default getAllOrganizationOfCongregationHandler;