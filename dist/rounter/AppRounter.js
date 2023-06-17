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
const serve_static_1 = __importDefault(require("serve-static"));
//Router
const LoginRouter_1 = __importDefault(require("./LoginRouter"));
const ResetPassRouter_1 = __importDefault(require("./ResetPassRouter"));
const APIRouter_1 = __importDefault(require("./APIRouter"));
const AvatarUploadRouter_1 = __importDefault(require("./AvatarUploadRouter"));
const verifyUserMiddleware_1 = __importDefault(require("../custom_middleware/verifyUserMiddleware"));
const appRouter = express_1.default.Router();
appRouter.use(verifyUserMiddleware_1.default);
appRouter.use((0, serve_static_1.default)(path_1.default.join(__dirname, '../../public')));
appRouter.use('/login', LoginRouter_1.default);
appRouter.use('/reset-password', ResetPassRouter_1.default);
appRouter.use('/api', APIRouter_1.default);
appRouter.use('/upload', AvatarUploadRouter_1.default);
appRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = req;
    request.user ? res.sendFile(path_1.default.join(__dirname, '../../views/fbims-app/app.html')) : res.redirect('/app/login');
}));
exports.default = appRouter;
