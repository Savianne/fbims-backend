import { Request, Response } from "express";
import updateOrganizationInfo from "../mysql/updateOrganizationInfo";

const updateOrganizationInfoHandler = async (req: Request, res:Response) => {
    const organizationUID = req.params.organizationUID;
    const updateData = req.body;
   
    try {
        const result = await updateOrganizationInfo(organizationUID, updateData)
        if(result.querySuccess) {
            res.json({success: true})
        } else throw "No changes has made"
    }
    catch(err) {
        res.json({success: false, error: err});
    }
};

export default updateOrganizationInfoHandler;