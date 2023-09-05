import { Request, Response } from "express";

import deleteMinistryTransactionPromise from "../mysql/deleteMinistryTransaction";

const deleteMinistryHandler = async (req: Request, res:Response) => {
    const ministryUID = req.params.ministryUID;
    try {
        const result = await deleteMinistryTransactionPromise(ministryUID);
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

export default deleteMinistryHandler;