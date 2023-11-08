import { Request, Response } from "express";
import { IUserRequest } from "../types/IUserRequest";

import searchCongregationMembers from "../mysql/searchCongregationMembers";


const searchCongregationMembersHandler = async (req: Request, res: Response) => {
    const request = req as IUserRequest
    const congregationUID = request.user?.congregation;

    const searchTerm =  req.body.searchTerm;
    

    searchCongregationMembers(congregationUID as string, searchTerm)
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.log(err)
        res.json(err)
    })

}

export default searchCongregationMembersHandler;