import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import path from "path";
import { IUser } from "../types/IUser";

const handleResetPassword = (req: Request, res: Response) => {
    const token = req.params.token;

    if(!token) return res.status(401).send("Unauthorized!");

    const access_token_secret = process.env.ACCESS_TOKEN_SECRET as string;

    jwt.verify(token as string, access_token_secret, (error: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
        if(error) {
          return res.status(401).send("Unauthorized!");
        }
  
        if(decoded) {
          res.cookie('rpAccount', token);
          res.sendFile(path.join(__dirname, '../../views/reset-password/index.html'));
        } else {
            res.status(401).send("Unauthorized!");
        }
    })
}

export default handleResetPassword;