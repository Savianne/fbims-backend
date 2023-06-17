import { Request, Response } from "express";
import { IUserRequest } from "../types/IUserRequest";

import getRecordsCount from "../mysql/getRecordsCount";

const getRecordsCountHandler = async (req: Request, res:Response) => {
    const userRequest = req as IUserRequest;

    const table = req.params.container;
    switch(table) {
        case "members":
            getRecordsCount("members", userRequest.user?.congregation as string) 
            .then(result => {
                res.json(result)
            })
            .catch(err => res.json(err))
    }
}

export default getRecordsCountHandler;