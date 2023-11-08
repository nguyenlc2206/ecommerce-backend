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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import projects
const env_1 = __importDefault(require("../../../main/config/env"));
const bcrypt_1 = require("../../../shared/common/bcrypt");
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const either_1 = require("../../../shared/common/either");
const account_impl_1 = require("../../../infrastructure/repositories/account.impl");
let ChangePasswordServiceImpl = class ChangePasswordServiceImpl {
    accountRepo;
    // * constructor
    constructor() {
        this.accountRepo = typedi_1.Container.get(account_impl_1.AccountRepositoryImpl);
    }
    /** overiding execute method */
    async execute(entity) {
        // * check current password is correct
        const resultCheck = await this.handleCheckPasswordCorrect(entity?.body.passwordCurrent, entity?.account?.password);
        if (resultCheck.isFailure())
            return (0, either_1.failure)(resultCheck.error);
        if (!resultCheck.data)
            return (0, either_1.failure)(new appError_1.default('Current password is invalid!', 400));
        // * hash new password
        const resultHashPassword = await this.handleHashPassword(entity?.body?.password);
        if (resultHashPassword.isFailure())
            return (0, either_1.failure)(resultHashPassword.error);
        const { data: hashPassword } = resultHashPassword;
        // * change password
        const resultChanged = await this.handleChangePassword(entity, hashPassword);
        if (resultChanged.isFailure())
            return (0, either_1.failure)(resultChanged.error);
        return (0, either_1.success)(resultChanged.data);
    }
    /** @todo: check current password is correct */
    handleCheckPasswordCorrect = async (passwordInformed, hashPasswordUser) => {
        const { bcryptSalt } = env_1.default;
        const hasherAdapter = new bcrypt_1.BcryptAdapter(bcryptSalt);
        const result = await hasherAdapter.compare(passwordInformed, hashPasswordUser);
        return (0, either_1.success)(result);
    };
    /** @todo: hash new password */
    handleHashPassword = async (password) => {
        const { bcryptSalt } = env_1.default;
        const hasher = new bcrypt_1.BcryptAdapter(bcryptSalt);
        const hashedPassword = await hasher.hash(password);
        return (0, either_1.success)(hashedPassword);
    };
    /** @todo: change password */
    handleChangePassword = async (req, hashPassword) => {
        const _id = req?.accountId;
        const _itemUpdate = {
            password: hashPassword,
            passwordChangedAt: new Date(Date.now())
        };
        const itemUpdate = await this.accountRepo.update(_id, _itemUpdate);
        return (0, either_1.success)(itemUpdate);
    };
};
exports.ChangePasswordServiceImpl = ChangePasswordServiceImpl;
exports.ChangePasswordServiceImpl = ChangePasswordServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], ChangePasswordServiceImpl);
