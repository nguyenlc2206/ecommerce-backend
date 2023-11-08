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
exports.AccountController = void 0;
// * import lib
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import project
const create_cotroller_1 = require("../../../main/controllers/account/create.cotroller");
const updateMe_controller_1 = require("../../../main/controllers/account/updateMe.controller");
const getMe_controller_1 = require("../../../main/controllers/account/getMe.controller");
const getAll_cotroller_1 = require("../../../main/controllers/account/getAll.cotroller");
const delete_controller_1 = require("../../../main/controllers/account/delete.controller");
const update_controller_1 = require("../../../main/controllers/account/update.controller");
const getById_controller_1 = require("../../../main/controllers/account/getById.controller");
// ==============================||  ACCOUNT CONTROLLER ||============================== //
let AccountController = class AccountController {
    // * constructor
    constructor() { }
    // * create method
    create = async (req, res, next) => {
        const _init = new create_cotroller_1.CreateAccountController();
        return _init.execute(req, res, next);
    };
    // * update account me method
    updateMe = async (req, res, next) => {
        const _init = new updateMe_controller_1.UpdateMeAccountController();
        return _init.execute(req, res, next);
    };
    // * update account method
    update = async (req, res, next) => {
        const _init = new update_controller_1.UpdateAccountController();
        return _init.execute(req, res, next);
    };
    // * get account me
    getMe = async (req, res, next) => {
        const _init = new getMe_controller_1.GetAccountMeController();
        return _init.execute(req, res, next);
    };
    // * get account by id
    getById = async (req, res, next) => {
        const _init = new getById_controller_1.GetAccountByIdController();
        return _init.execute(req, res, next);
    };
    // * get all account
    getAll = async (req, res, next) => {
        const _init = new getAll_cotroller_1.GetAllAccountController();
        return _init.execute(req, res, next);
    };
    // * delete account
    delete = async (req, res, next) => {
        const _init = new delete_controller_1.DeleteAccountController();
        return _init.execute(req, res, next);
    };
};
exports.AccountController = AccountController;
exports.AccountController = AccountController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], AccountController);
