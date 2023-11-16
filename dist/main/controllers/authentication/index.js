"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationController = void 0;
// * import libs
const typedi_1 = require("typedi");
// * import projects
const login_controller_1 = require("../../../main/controllers/authentication/login.controller");
const protect_controller_1 = require("../../../main/controllers/authentication/protect.controller");
const changePassword_controller_1 = require("../../../main/controllers/authentication/changePassword.controller");
const forgotPassword_controller_1 = require("../../../main/controllers/authentication/forgotPassword.controller");
const logout_controller_1 = require("../../../main/controllers/authentication/logout.controller");
const changePasswordAdmin_controller_1 = require("../../../main/controllers/authentication/changePasswordAdmin.controller");
// ==============================||  AUTHENTICATION CONTROLLER ||============================== //
let AuthenticationController = class AuthenticationController {
    /** constructor */
    constructor() { }
    /** login method */
    login = async (req, res, next) => {
        const _init = new login_controller_1.LoginController();
        return _init.execute(req, res, next);
    };
    /** logout method */
    logout = async (req, res, next) => {
        const _init = new logout_controller_1.LogoutController();
        return _init.execute(req, res, next);
    };
    /** protect router */
    protect = async (req, res, next) => {
        const _init = new protect_controller_1.ProtectedRoutesController();
        return _init.execute(req, res, next);
    };
    /** change password router */
    changePassword = async (req, res, next) => {
        const _init = new changePassword_controller_1.ChangePasswordController();
        return _init.execute(req, res, next);
    };
    /** change password router */
    changePasswordAdmin = async (req, res, next) => {
        const _init = new changePasswordAdmin_controller_1.ChangePasswordAdminController();
        return _init.execute(req, res, next);
    };
    /** forgot password router */
    forgotPassword = async (req, res, next) => {
        const _init = new forgotPassword_controller_1.ForgotPasswordController();
        return _init.execute(req, res, next);
    };
};
exports.AuthenticationController = AuthenticationController;
exports.AuthenticationController = AuthenticationController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], AuthenticationController);
