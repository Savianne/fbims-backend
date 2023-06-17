import express, { RequestHandler } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import serveStatic from 'serve-static';
import { Server, Socket } from 'socket.io';

import http from 'http';

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
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Specify the allowed origin(s)
    methods: ['GET', 'POST'] // Specify the allowed HTTP methods
  }
});

const port = process.env.PORT;

// parse application/json
app.use(bodyParser.json());

//Use Cookie-parser
app.use(cookieParser())

//Setup CORS
app.use(config.allowCORS? config.allowCORS == "*"? cors() : cors({origin: config.allowCORS}) : (req, res, next) => next());

app.use(serveStatic(path.join(__dirname, '../public')))

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, '../views/register-congregation/index.html'));
});

app.post('/request-access', handleRequestAccess);

app.use('/app', AppRouter);

io.on('connection', (socket: Socket) => {
  console.log('A user connected.');

  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });

  socket.on('chat message', (message: string) => {
    console.log('Received message:', message);
    // Handle the message and emit it back to clients if needed
  });
});

server.listen(3008, () => {
  console.log(`Server listening on port 3008`);
});

app.listen(port, () => console.log(`Server is Up and running at port: ${port}`));