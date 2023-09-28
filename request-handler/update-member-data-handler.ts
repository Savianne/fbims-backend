import { Request, Response } from "express";
import updateMemberBasicInfo from "../mysql/updateMemberBasicInfo";
import updateCurrentAddress from "../mysql/updateCurrentAddress";
import updatePermanentAddress from "../mysql/updatePermanentAddress";

const updateMemberDataHandler = async (req: Request, res:Response) => {
    const category = req.params.category;
    const memberUID = req.params.memberUID;
    const updateData = req.body;
   
    switch(category) {
        case "basic-info": 
            try {
                const result = await updateMemberBasicInfo(memberUID, updateData);
                if(result.querySuccess) {
                    res.json({success: true})
                } else throw "No changes has made"
            } catch (err) {
                res.json({success: false, error: err});
            }
        break;
        case "address":
            const label = updateData.label;

            if(label == "current") {
                try {
                    const result = await updateCurrentAddress(memberUID, updateData);
                    if(result.querySuccess) {
                        res.json({success: true})
                    } else throw "No changes has made"
                } catch (err) {
                    res.json({success: false, error: err});
                }
            } else if(label == "permanent") {
                try {
                    const result = await updatePermanentAddress(memberUID, updateData);
                    if(result.querySuccess) {
                        res.json({success: true})
                    } else throw "No changes has made"
                } catch (err) {
                    res.json({success: false, error: err});
                }
            }
        break;
        case "contact":
            console.log(category);
    }
};

export default updateMemberDataHandler;