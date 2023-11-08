"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationRoutes = void 0;
const typedi_1 = require("typedi");
// * import projects
const account_1 = require("../../main/controllers/account");
const authentication_1 = require("../../main/controllers/authentication");
const uploadFile_1 = __importDefault(require("../../shared/common/uploadFile"));
/** init instance controller */
const instanceAuth = typedi_1.Container.get(authentication_1.AuthenticationController);
const instanceAccount = typedi_1.Container.get(account_1.AccountController);
/** @todo: init routes */
const AuthenticationRoutes = (router) => {
    // * create account
    router.post('/register', uploadFile_1.default.single('image'), instanceAccount.create);
    // * login router
    router.post('/login', instanceAuth.login);
    // * change password account
    router.patch('/change-password', instanceAuth.protect, instanceAuth.changePassword);
    // * forgot password
    router.patch('/forgot-password', instanceAuth.forgotPassword);
    // * logout router
    router.get('/logout', instanceAuth.protect, instanceAuth.logout);
};
exports.AuthenticationRoutes = AuthenticationRoutes;
