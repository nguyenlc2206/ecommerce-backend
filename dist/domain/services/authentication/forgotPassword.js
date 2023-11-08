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
exports.ForgotPasswordServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
const env_1 = __importDefault(require("../../../main/config/env"));
const either_1 = require("../../../shared/common/either");
const Account_1 = require("../../../domain/models/Account");
const account_impl_1 = require("../../../infrastructure/repositories/account.impl");
const bcrypt_1 = require("../../../shared/common/bcrypt");
let ForgotPasswordServiceImpl = class ForgotPasswordServiceImpl {
    /** init service and repo */
    accountRepo;
    // * constructor
    constructor() {
        this.accountRepo = typedi_1.Container.get(account_impl_1.AccountRepositoryImpl);
    }
    /** overiding execute method */
    async execute(entity, account) {
        /** hash password */
        const _hashPassword = await this.handleHashPassword(entity?.body?.password);
        const _entity = { password: _hashPassword, passwordChangedAt: new Date(Date.now()) };
        /** update account */
        const response = await this.accountRepo.update(account.id, _entity);
        const _init = new Account_1.AccountModel();
        const result = _init.fromAccountModel(response);
        return (0, either_1.success)(result);
    }
    // * hash password
    handleHashPassword = async (password) => {
        const { bcryptSalt } = env_1.default;
        const hasher = new bcrypt_1.BcryptAdapter(bcryptSalt);
        const hashedPassword = await hasher.hash(password);
        return hashedPassword;
    };
};
exports.ForgotPasswordServiceImpl = ForgotPasswordServiceImpl;
exports.ForgotPasswordServiceImpl = ForgotPasswordServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], ForgotPasswordServiceImpl);
