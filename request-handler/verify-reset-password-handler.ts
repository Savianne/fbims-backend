import { Request, Response } from "express";
import bcrypt from "bcrypt";
import resetUserPassword from "../mysql/restUserPassword";

const verifyResetPasswordHandler = async (req: Request, res: Response) => {
  const password = req.body.password;
  const email = req.body.email;

  const validate = (function validatePassword(password: string): null | string {
    const regex = /^(?=.*[A-Z])(?=.*\d).*$/;
  
    if (password.length < 8) {
      return "Password Must be 8 characters long";
    }
  
    if (!regex.test(password)) {
      return "Password Must must have atleast 1 numeric and atleas 1 uppercase letter";
    }
  
    return null;
  })(password);

  if(validate) {
    return res.json({changePassSuccess: false, error: validate});
  } else {
    const newHashedPassword = await bcrypt.hash(password, 10);

    const resetPassResponse = await resetUserPassword(email, newHashedPassword);

    if(resetPassResponse && resetPassResponse.affectedRows > 0) {
      return res.json({changePassSuccess: true});
    } 

    return res.json({changePassSuccess: false, error: "Query Error!"});
  }

}

export default verifyResetPasswordHandler;