import express, { RequestHandler } from 'express';
import path from 'path';
import serveStatic from 'serve-static';

import handleResetPassword from '../request-handler/reset-password-handler';
import getResetPassAccount from '../request-handler/get-reset-pass-account-handler';
import verifyResetPasswordHandler from '../request-handler/verify-reset-password-handler';

const resetPassRouter = express.Router();

// resetPassRouter.use('/', serveStatic(path.join(__dirname, '../../public')));

resetPassRouter.get('/:token', handleResetPassword);

resetPassRouter.post('/get-reset-pass-account', getResetPassAccount);

resetPassRouter.post('/verify-reset-password', verifyResetPasswordHandler);

export default resetPassRouter;