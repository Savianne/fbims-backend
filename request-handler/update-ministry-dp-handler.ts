import { Request, Response } from "express";
import updateMinistryDisplayPicture from "../mysql/updateMinistryDP";

const updateMinistryDisplayPictureHandler = async (req: Request, res:Response) => {
    const query = req.params.query;
    const ministryUID = req.params.ministryUID;
    const picture = req.params.dp;
   
    try {
        const result = await updateMinistryDisplayPicture(ministryUID, {picture, query: query as "remove" | "update"});
        if(result.querySuccess) {
            res.json({success: true})
        } else throw "No changes has made"
    }
    catch(err) {
        res.json({success: false, error: err});
    }
};

export default updateMinistryDisplayPictureHandler;