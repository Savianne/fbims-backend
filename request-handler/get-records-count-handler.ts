import { Request, Response } from "express";
import { IUserRequest } from "../types/IUserRequest";

import getRecordsCount from "../mysql/getRecordsCount";

const getRecordsCountHandler = async (req: Request, res:Response) => {
    const userRequest = req as IUserRequest;

    const table = req.params.container;

    try {
        const result = await getRecordsCount(table, userRequest.user?.congregation as string);
        res.json(result);
    }
    catch(err) {
        console.log(err);
        res.json(err);
    }

}

export default getRecordsCountHandler;