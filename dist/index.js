"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const serve_static_1 = __importDefault(require("serve-static"));
//configuration file
const config_1 = __importDefault(require("./config"));
//Request Handlers
const request_access_handler_1 = __importDefault(require("./request-handler/request-access-handler"));
//Routers
const AppRounter_1 = __importDefault(require("./rounter/AppRounter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
// parse application/json
app.use(body_parser_1.default.json());
//Use Cookie-parser
app.use((0, cookie_parser_1.default)());
//Setup CORS
app.use(config_1.default.allowCORS ? config_1.default.allowCORS == "*" ? (0, cors_1.default)() : (0, cors_1.default)({ origin: config_1.default.allowCORS }) : (req, res, next) => next());
//Verify User Request
// app.use(verifyUserMiddleware as RequestHandler);
// app.use(express.static(path.join(__dirname, '../public')));
app.use((0, serve_static_1.default)(path_1.default.join(__dirname, '../public')));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, '../views/register-congregation/index.html'));
}));
app.post('/request-access', request_access_handler_1.default);
app.use('/app', AppRounter_1.default);
// app.get()
app.listen(port, () => console.log(`Server is Up and running at port: ${port}`));
