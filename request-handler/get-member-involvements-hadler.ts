import { Request, Response } from "express";

import getMemberInvolvements from "../mysql/getMemberInvolvements";

const getMemberInvolvementsHandler = async (req: Request, res:Response) => {
    const memberUID = req.params.memberUID;

    try {
        const result = await getMemberInvolvements(memberUID);
        res.json(result);
    }
    catch(err) {
        console.log(err)
        res.json(err);
    }

}

export default getMemberInvolvementsHandler;