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
exports.LoginServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import projects
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const env_1 = __importDefault(require("../../../main/config/env"));
const either_1 = require("../../../shared/common/either");
const Account_1 = require("../../../domain/models/Account");
const account_impl_1 = require("../../../infrastructure/repositories/account.impl");
const bcrypt_1 = require("../../../shared/common/bcrypt");
const jwt_1 = require("../../../shared/common/jwt");
const token_impl_1 = require("../../../infrastructure/repositories/token.impl");
let LoginServiceImpl = class LoginServiceImpl {
    /** init repo */
    accountRepo;
    tokenRepo;
    // * constructor
    constructor() {
        this.accountRepo = typedi_1.Container.get(account_impl_1.AccountRepositoryImpl);
        this.tokenRepo = typedi_1.Container.get(token_impl_1.TokenRepositoryImpl);
    }
    /** overiding execute method */
    async execute(entity) {
        /** get account by email */
        const account = await this.handleGetAccountByEmail(entity?.email);
        if (account.isFailure())
            return (0, either_1.failure)(account.error);
        /** compare password */
        const hashPassword = account?.data?.password;
        const resultCompare = await this.handleComparePassword(entity?.password, hashPassword);
        if (resultCompare.isFailure())
            return (0, either_1.failure)(resultCompare.error);
        if (!resultCompare.data)
            return (0, either_1.failure)(new appError_1.default('Password is wrong!', 400));
        /** generate token by email and id */
        const resultToken = await this.handleGenerateToken(account.data);
        if (resultToken.isFailure())
            return (0, either_1.failure)(resultToken.error);
        const { data: token } = resultToken;
        /** handle save token to database */
        const resultSave = await this.handleSaveToken(account.data, token);
        if (resultSave.isFailure())
            return (0, either_1.failure)(resultSave.error);
        /** reponse result */
        const _init = new Account_1.AccountModel();
        const result = _init.fromAccountModelLogin(account.data, token);
        return (0, either_1.success)(result);
    }
    /** get account by email */
    handleGetAccountByEmail = async (email) => {
        const response = await this.accountRepo.getByEmail(email);
        if (!response)
            return (0, either_1.failure)(new appError_1.default('Email is not exists!', 400));
        return (0, either_1.success)(response);
    };
    /** compare password */
    handleComparePassword = async (passwordInformed, hashPasswordUser) => {
        const { bcryptSalt } = env_1.default;
        const hasherAdapter = new bcrypt_1.BcryptAdapter(bcryptSalt);
        const result = await hasherAdapter.compare(passwordInformed, hashPasswordUser);
        return (0, either_1.success)(result);
    };
    /** generate token by email and id */
    handleGenerateToken = async (account) => {
        const { jwtSecret, expiresIn } = env_1.default;
        const tokenGeneratorAdapter = new jwt_1.TokenGeneratorAdapter(jwtSecret, expiresIn);
        const _key = { email: account.email, id: account.id };
        const token = await tokenGeneratorAdapter.generate(_key);
        return (0, either_1.success)(token);
    };
    /** hande save token to database */
    handleSaveToken = async (account, token) => {
        const data = {
            accountId: account?.id,
            token: token,
            createdTime: new Date(Date.now())
        };
        const response = await this.tokenRepo.create(data);
        return (0, either_1.success)(response);
    };
};
exports.LoginServiceImpl = LoginServiceImpl;
exports.LoginServiceImpl = LoginServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], LoginServiceImpl);
