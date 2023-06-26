import { Request, Response } from "express";
import { IUserRequest } from "../types/IUserRequest";

import searchMemberForMinistryMembership from "../mysql/searchCongregationMemberForAddingToMinistry";


const searchMemberForAddingMinistryMembersHandler = async (req: Request, res: Response) => {
    const request = req as IUserRequest
    const congregationUID = request.user?.congregation;

    const ministryUID = req.body.ministryUID;
    const searchTerm =  req.body.searchTerm;
    searchMemberForMinistryMembership(ministryUID, congregationUID as string, searchTerm)
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.log(err)
        res.json(err)
    })

}

export default searchMemberForAddingMinistryMembersHandler;