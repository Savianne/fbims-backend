import { Request, Response } from "express";
import { IUserRequest } from "../types/IUserRequest";

const addMemberRecord = (req: Request, res: Response) => {
    const request = req as IUserRequest
    const adminUID = request.user?.UID;
    const congregationUID = request.user?.congregation;

    

}

export default addMemberRecord;