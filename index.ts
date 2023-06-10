import express, { RequestHandler } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import pool from './mysql/pool';
import serveStatic from 'serve-static';

//Types
import { IUserRequest } from './types/IUserRequest';
import { IUser } from './types/IUser';

//configuration file
import config from "./config";

//Custom Middlewares
import verifyUserMiddleware from './custom_middleware/verifyUserMiddleware';

//Request Handlers
import handleRequestAccess from './request-handler/request-access-handler';

//Routers
import AppRouter from "./rounter/AppRounter";

dotenv.config();

const app = express();
const port = process.env.PORT;

// parse application/json
app.use(bodyParser.json());

//Use Cookie-parser
app.use(cookieParser())

//Setup CORS
app.use(config.allowCORS? config.allowCORS == "*"? cors() : cors({origin: config.allowCORS}) : (req, res, next) => next());


//Verify User Request
// app.use(verifyUserMiddleware as RequestHandler);

// app.use(express.static(path.join(__dirname, '../public')));

app.use(serveStatic(path.join(__dirname, '../public')))

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, '../views/register-congregation/index.html'));
});

app.post('/request-access', handleRequestAccess);

app.use('/app', AppRouter);

// app.get()
app.listen(port, () => console.log(`Server is Up and running at port: ${port}`));