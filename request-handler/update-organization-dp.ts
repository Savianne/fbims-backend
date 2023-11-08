import { Request, Response } from "express";
import updateOrganizationDisplayPicture from "../mysql/updateOrganizationDp";

const updateOrgDisplayPictureHandler = async (req: Request, res:Response) => {
    const query = req.params.query;
    const orgUID = req.params.orgUID;
    const picture = req.params.dp;
   
    try {
        const result = await updateOrganizationDisplayPicture(orgUID, {picture, query: query as "remove" | "update"});
        if(result.querySuccess) {
            res.json({success: true})
        } else throw "No changes has made"
    }
    catch(err) {
        res.json({success: false, error: err});
    }
};

export default updateOrgDisplayPictureHandler;