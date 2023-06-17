import { Request, Response } from "express";
import fs from "fs-extra";
import { IUserRequest } from "../types/IUserRequest";
import { io } from "..";
import path from "path";
import { TMinistryData } from "../mysql/addMinistryTransaction";
import addMinistryTransactionPromise from "../mysql/addMinistryTransaction";

const addMinistryHandler = async (req: Request, res:Response) => {
    const user = (req as IUserRequest).user
    const reqData = req.body.data as TMinistryData
    try {
        const result = await addMinistryTransactionPromise({congregation: user?.congregation as string, adminUID: user?.UID as string}, reqData);
        if(result.querySuccess) {
            if(reqData.avatar) {
                fs.move(path.join(__dirname, "../../", "tmp-upload", reqData.avatar), path.join(__dirname, "../../", "public/assets/images/avatar", reqData.avatar), err => {
                    if(err) {
                        console.log(err);
                    }
                    io.emit('ADDED_NEW_MINISTRY');
                    res.json({success: true});
                })
            } 
            else {
                io.emit('ADDED_NEW_MINISTRY');
                res.json({success: true});
            }
        } else throw result;
    }
    catch(err) {
        console.log(err)
        res.json({
            success: false,
            error: err
        });
    }

}

export default addMinistryHandler;