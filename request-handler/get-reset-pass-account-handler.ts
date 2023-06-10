import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../types/IUser";

const getResetPassAccount = (req: Request, res: Response) => {
    const resetPassAccountCookie = req.cookies.rpAccount;
  
    if(!resetPassAccountCookie) return res.status(401).send("No Reset Token FOund!");
  
    const access_token_secret = process.env.ACCESS_TOKEN_SECRET as string;
  
    jwt.verify(resetPassAccountCookie as string, access_token_secret, (error: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
        if(error) {
            res.clearCookie('rpAccount');
            return res.status(401).send("Unauthorized!");
        }
  
        if(decoded) {
            const account = decoded as { user: IUser, expDate: Date };
            res.clearCookie('rpAccount');
            res.json(account);
        } else {
            res.clearCookie('rpAccount');
            res.status(401).send("Unauthorized!");
        }
    })
}

export default getResetPassAccount;