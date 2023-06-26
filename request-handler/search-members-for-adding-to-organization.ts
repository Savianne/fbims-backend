import { Request, Response } from "express";
import { IUserRequest } from "../types/IUserRequest";

import searchMemberForOrganizationMembership from "../mysql/searchCongregatioMembersForAddingToOrganization";


const searchMemberForAddingOrganizationMembersHandler = async (req: Request, res: Response) => {
    const request = req as IUserRequest
    const congregationUID = request.user?.congregation;

    const organizationUID = req.body.organizationUID;
    const searchTerm =  req.body.searchTerm;
    

    searchMemberForOrganizationMembership(organizationUID, congregationUID as string, searchTerm)
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.log(err)
        res.json(err)
    })

}

export default searchMemberForAddingOrganizationMembersHandler;