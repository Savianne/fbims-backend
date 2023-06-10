import { Request, Response } from "express";

import getUserAccountInfoByEmail from "../mysql/getUserAccountInfoByEmail";
import getUserAccountInfoByCPNumber from "../mysql/getUserAccountByCPNumber";
import addRequestAccess from "../mysql/addRequestAccess";

const handleRequestAccess = async (req: Request, res: Response) => {
    const reqData = req.body;

    const emailExistInDb = ((await getUserAccountInfoByEmail(reqData.email)) as any[]).length;
    
    if(emailExistInDb) {
        return res.json({querySuccess: false, errorField: {feild: "email", errorInfo: {errorText: "Email Already Exist!", validationResult: [{passed: false, caption: "Email Must be unique!"}]}}})
    }

    const numberExistInDb = ((await getUserAccountInfoByCPNumber(reqData.cp_number)) as any[]).length;

    if(numberExistInDb) {
        return res.json({querySuccess: false, errorField: {feild: "cp_number", errorInfo: {errorText: "CP Number Already Exist!", validationResult: [{passed: false, caption: "CP Number Must be unique!"}]}}})
    }

    
    addRequestAccess(reqData)
    .then(query => {
        if(query.affectedRows && query.affectedRows > 0) {
            return res.json({querySuccess: true});
        } else {
            return res.json({querySuccess: false, queryError: "Query Faild, Please try again!"});
        }
    })
    .catch((err) => {
        if(err.code == "ER_DUP_ENTRY") {
            return res.json({querySuccess: false, queryError: "The Email or CP Number you provided was already exist in the Request Queue, You can only send as request once"});
        } else {
            return res.json({querySuccess: false, queryError: "Query Faild, Please try again!"});
        }
    })

}

export default handleRequestAccess;