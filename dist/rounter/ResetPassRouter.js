"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reset_password_handler_1 = __importDefault(require("../request-handler/reset-password-handler"));
const get_reset_pass_account_handler_1 = __importDefault(require("../request-handler/get-reset-pass-account-handler"));
const verify_reset_password_handler_1 = __importDefault(require("../request-handler/verify-reset-password-handler"));
const resetPassRouter = express_1.default.Router();
// resetPassRouter.use('/', serveStatic(path.join(__dirname, '../../public')));
resetPassRouter.get('/:token', reset_password_handler_1.default);
resetPassRouter.post('/get-reset-pass-account', get_reset_pass_account_handler_1.default);
resetPassRouter.post('/verify-reset-password', verify_reset_password_handler_1.default);
exports.default = resetPassRouter;
