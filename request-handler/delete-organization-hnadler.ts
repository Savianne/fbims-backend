import { Request, Response } from "express";

import deleteOrganizationTransactionPromise from "../mysql/deleteOrganizationTransaction";

const deleteOrganizationHandler = async (req: Request, res:Response) => {
    const organizationUID = req.params.organizationUID;
    try {
        const result = await deleteOrganizationTransactionPromise(organizationUID);
        if(result.querySuccess) {
            res.json({success: true});
        } else throw result;
    }
    catch(err) {
        res.json({
            success: false,
            error: ""
        });
    }

}

export default deleteOrganizationHandler;