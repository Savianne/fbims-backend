import { Request, Response } from "express";
import updateDisplayPicture from "../mysql/updateDisplayPicture";

const updateDisplayPictureHandler = async (req: Request, res:Response) => {
    const query = req.params.query;
    const memberUID = req.params.memberUID;
    const picture = req.params.dp;
   
    try {
        const result = await updateDisplayPicture(memberUID, {picture, query: query as "remove" | "update"});
        if(result.querySuccess) {
            res.json({success: true})
        } else throw "No changes has made"
    }
    catch(err) {
        res.json({success: false, error: err});
    }
};

export default updateDisplayPictureHandler;