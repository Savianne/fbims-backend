"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const serve_static_1 = __importDefault(require("serve-static"));
//Request Handlers
const send_otp_req_handler_1 = __importDefault(require("../request-handler/send-otp-req-handler"));
const find_account_1 = __importDefault(require("../request-handler/find-account"));
const verify_login_1 = __importDefault(require("../request-handler/verify-login"));
const get_pending_user_login_1 = __importDefault(require("../request-handler/get-pending-user-login"));
const verify_forgot_pass_otp_1 = __importDefault(require("../request-handler/verify-forgot-pass-otp"));
const loginRouter = express_1.default.Router();
loginRouter.use('/', (0, serve_static_1.default)(path_1.default.join(__dirname, '../../public')));
loginRouter.get('/', (req, res) => {
    const request = req;
    request.user ? res.redirect('/app') : res.sendFile(path_1.default.join(__dirname, '../../views/login/index.html'));
});
loginRouter.delete('/remove-pending-user-login', (req, res) => {
    res.clearCookie('pendingUserLogin');
    res.json({ success: true });
});
loginRouter.post('/verify-login', verify_login_1.default);
loginRouter.post('/get-pending-user-login', get_pending_user_login_1.default);
loginRouter.post('/find-account', find_account_1.default);
loginRouter.post('/send-otp', send_otp_req_handler_1.default);
loginRouter.post('/verify-forgot-pass-otp', verify_forgot_pass_otp_1.default);
exports.default = loginRouter;
