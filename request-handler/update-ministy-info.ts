import { Request, Response } from "express";
import updateMinistryInfo from "../mysql/updateMinistryInfo";

const updateMinistryInfoHandler = async (req: Request, res:Response) => {
    const ministryUID = req.params.ministryUID;
    const updateData = req.body;
   
    try {
        const result = await updateMinistryInfo(ministryUID, updateData)
        if(result.querySuccess) {
            res.json({success: true})
        } else throw "No changes has made"
    }
    catch(err) {
        res.json({success: false, error: err});
    }
};

export default updateMinistryInfoHandler;