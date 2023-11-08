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
exports.ProtectedServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import projects
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const env_1 = __importDefault(require("../../../main/config/env"));
const either_1 = require("../../../shared/common/either");
const account_impl_1 = require("../../../infrastructure/repositories/account.impl");
const jwt_1 = require("../../../shared/common/jwt");
const token_impl_1 = require("../../../infrastructure/repositories/token.impl");
let ProtectedServiceImpl = class ProtectedServiceImpl {
    accountRepo;
    tokenRepo;
    // * constructor
    constructor() {
        this.accountRepo = typedi_1.Container.get(account_impl_1.AccountRepositoryImpl);
        this.tokenRepo = typedi_1.Container.get(token_impl_1.TokenRepositoryImpl);
    }
    /** overiding execute method */
    async execute(entity) {
        //* getting tokken and check of it's there
        const resultToken = this.handleGetTokenFromHeaders(entity);
        if (resultToken.isFailure())
            return (0, either_1.failure)(resultToken.error);
        const { data: accessToken } = resultToken;
        //* Verification token
        const resultVerify = await this.handleVerifyToken(accessToken);
        if (resultVerify.isFailure())
            return (0, either_1.failure)(resultVerify.error);
        const { key: _key, iat: _iat } = resultVerify.data;
        const keyParse = JSON.parse(JSON.stringify(_key));
        //* Check if account still exists by email
        const resultGet = await this.handleGetAccountById(keyParse?.id);
        if (resultGet.isFailure())
            return (0, either_1.failure)(resultGet.error);
        // console.log('>>>Check result:', resultGet.data);
        //* Check email
        const isCheckEmail = this.handleCheckEmailChanged(keyParse?.email, resultGet.data?.email);
        if (!isCheckEmail)
            return (0, either_1.failure)(new appError_1.default('User recently change email! Please login again.', 401));
        // * Get token from database
        const resultTokenGet = await this.handeGetToken(keyParse?.id, accessToken);
        if (resultTokenGet.isFailure())
            return (0, either_1.failure)(resultTokenGet.error);
        //* Check if cusomter changed password after the token was issued
        const passwordChangedAt = resultGet.data?.passwordChangedAt;
        const resultChangedAt = this.handlePasswordChangedAfter(_iat, passwordChangedAt);
        if (resultChangedAt.isFailure())
            return (0, either_1.failure)(resultChangedAt.error);
        // * processing account request
        return (0, either_1.success)({
            password: resultGet.data?.password,
            id: resultGet.data?.id,
            email: resultGet.data?.email,
            phoneNo: resultGet.data?.phoneNo,
            fullName: resultGet.data?.fullName,
            role: resultGet.data?.role,
            accessToken: accessToken
        });
    }
    /** @todo: Getting tokken and check of it's there**/
    handleGetTokenFromHeaders = (req) => {
        let accessToken;
        if (req.headers?.authorization && req.headers?.authorization.startsWith('Bearer')) {
            accessToken = req.headers?.authorization.split(' ')[1];
        }
        if (!accessToken)
            return (0, either_1.failure)(new appError_1.default('You are not login. Please login to get access!', 401));
        return (0, either_1.success)(accessToken);
    };
    /** @todo: get token by accountId and token form database */
    handeGetToken = async (id, token) => {
        const response = await this.tokenRepo.getByaccountId(id, token);
        if (!response)
            return (0, either_1.failure)(new appError_1.default('Token is expires!', 401));
        return (0, either_1.success)(response);
    };
    /** @todo: Verification token **/
    handleVerifyToken = async (token) => {
        const { jwtSecret, expiresIn } = env_1.default;
        const tokenGeneratorAdapter = new jwt_1.TokenGeneratorAdapter(jwtSecret, expiresIn);
        const decode = await tokenGeneratorAdapter.decrypt(token);
        return (0, either_1.success)(decode);
    };
    /** @todo: Check if account still exists by email **/
    handleGetAccountById = async (id) => {
        const accountFinded = await this.accountRepo.getById(id);
        if (!accountFinded)
            return (0, either_1.failure)(new appError_1.default('Email/Id is not exists in database!', 400));
        return (0, either_1.success)(accountFinded);
    };
    /** handle check email change */
    handleCheckEmailChanged = (emailOld, emailNew) => {
        return emailOld === emailNew;
    };
    /** @todo: Check if customer changed password after the token was issued **/
    handlePasswordChangedAfter = (timeDecode, passwordChangedAt) => {
        const numberChangeAt = passwordChangedAt.getTime();
        const changedTimestamp = parseInt((numberChangeAt / 1000).toString(), 10);
        if (timeDecode < changedTimestamp)
            return (0, either_1.failure)(new appError_1.default('User recently change password! Please login again.', 401));
        return (0, either_1.success)(false);
    };
};
exports.ProtectedServiceImpl = ProtectedServiceImpl;
exports.ProtectedServiceImpl = ProtectedServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], ProtectedServiceImpl);
