import express, { RequestHandler } from 'express';
import path from 'path';
import serveStatic from 'serve-static';
import { IUserRequest } from '../types/IUserRequest';

//Request Handlers
import sendOTPReqHandler from '../request-handler/send-otp-req-handler';
import findAccount from '../request-handler/find-account';
import verifyLogin from '../request-handler/verify-login';
import getPendingUserLogin from '../request-handler/get-pending-user-login';
import verifyForgotPassOTP from '../request-handler/verify-forgot-pass-otp';


const loginRouter = express.Router();

loginRouter.use('/', serveStatic(path.join(__dirname, '../../public')))

loginRouter.get('/', (req, res) => {
    const request = req as IUserRequest;
    request.user? res.redirect('/app') : res.sendFile(path.join(__dirname, '../../views/login/index.html'));
}); 

loginRouter.delete('/remove-pending-user-login', (req, res) => {
    res.clearCookie('pendingUserLogin');
    res.json({success: true});
});

loginRouter.post('/verify-login', verifyLogin);

loginRouter.post('/get-pending-user-login', getPendingUserLogin);

loginRouter.post('/find-account', findAccount);

loginRouter.post('/send-otp', sendOTPReqHandler);

loginRouter.post('/verify-forgot-pass-otp', verifyForgotPassOTP);




export default loginRouter;