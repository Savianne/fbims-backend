import express, { RequestHandler } from 'express';
import path from 'path';
import serveStatic from 'serve-static';

import { IUserRequest } from "../types/IUserRequest";

//Router
import loginRouter from './LoginRouter';
import resetPassRouter from './ResetPassRouter';
import APIRouter from './APIRouter';
import AvatarUploadRouter from './AvatarUploadRouter';

import verifyUserMiddleware from '../custom_middleware/verifyUserMiddleware';

const appRouter = express.Router();

appRouter.use(verifyUserMiddleware as RequestHandler)

appRouter.use(serveStatic(path.join(__dirname, '../../public')));

appRouter.use('/login', loginRouter);

appRouter.use('/reset-password', resetPassRouter);

appRouter.use('/api', APIRouter);

appRouter.use('/upload', AvatarUploadRouter);

appRouter.get('/', async (req, res) => {
    const request = req as IUserRequest;
    request.user? res.sendFile(path.join(__dirname, '../../views/fbims-app/app.html')) : res.redirect('/app/login');
});





export default appRouter;