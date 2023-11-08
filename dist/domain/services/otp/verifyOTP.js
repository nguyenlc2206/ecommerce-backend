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
exports.VerifyOTPServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
const either_1 = require("../../../shared/common/either");
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const account_impl_1 = require("../../../infrastructure/repositories/account.impl");
const otp_1 = require("../../../shared/common/otp");
const otp_impl_1 = require("../../../infrastructure/repositories/otp.impl");
const forgotPassword_1 = require("../authentication/forgotPassword");
let VerifyOTPServiceImpl = class VerifyOTPServiceImpl {
    /** init repo */
    OTPRepo;
    accountRepo;
    /** init services */
    OTPService;
    forgotPasswordService;
    // * constructor
    constructor() {
        this.OTPService = typedi_1.Container.get(otp_1.OTPService);
        this.OTPRepo = typedi_1.Container.get(otp_impl_1.OTPRepositoryImpl);
        this.accountRepo = typedi_1.Container.get(account_impl_1.AccountRepositoryImpl);
        this.forgotPasswordService = typedi_1.Container.get(forgotPassword_1.ForgotPasswordServiceImpl);
    }
    /** define otp type functions */
    OTPReducer = (type, req, account) => {
        switch (type) {
            case 'OTPForgotPassword': {
                if (account)
                    this.forgotPasswordService.execute(req, account);
                break;
            }
            default: {
                break;
            }
        }
    };
    /** overiding execute method */
    async execute(entity) {
        // * get account by email
        const resultGet = await this.handleGetAccountByEmail(entity?.body?.email);
        if (resultGet.isFailure())
            return (0, either_1.failure)(resultGet.error);
        const { data: account } = resultGet;
        // * get OTP by accountId and typeOTP
        const resultGetOTP = await this.handleGetOTPInfo(account?.id, entity?.body?.OTPType);
        if (resultGetOTP.isFailure())
            return (0, either_1.failure)(resultGetOTP.error);
        const { data: OTPInfo } = resultGetOTP;
        // * handle verify OTP
        const resultVerify = await this.handleVerifyOTP(account?.phoneNo, entity?.body?.OTP, OTPInfo?.OTP);
        if (resultVerify.isFailure())
            return (0, either_1.failure)(resultVerify.error);
        if (resultVerify.data) {
            /** processing with relative actions */
            this.OTPReducer(entity?.body?.OTPType, entity, account);
            const resultUpdate = await this.handleUpdateOTP(OTPInfo);
            /** reset retry generate OTP */
            if (resultUpdate.isFailure())
                return (0, either_1.failure)(resultUpdate.error);
        }
        return (0, either_1.success)(OTPInfo);
    }
    /** @todo: get account by email */
    handleGetAccountByEmail = async (email) => {
        const response = await this.accountRepo.getByEmail(email);
        if (!response)
            return (0, either_1.failure)(new appError_1.default('Email is not exists!', 400));
        return (0, either_1.success)(response);
    };
    /** @todo: get OTP by accountId and typeOTP */
    handleGetOTPInfo = async (accountId, OTPType) => {
        const crities = { accountId: accountId, OTPType: OTPType };
        const res = await this.OTPRepo.getByaccountId(crities);
        return (0, either_1.success)(res);
    };
    /** @todo: handle verify OTP */
    handleVerifyOTP = async (phone, otp, hash) => {
        const entity = {
            phone: phone,
            otp: otp,
            hash: hash,
            key: 'verysecret'
        };
        const hashOTP = await this.OTPService.verifyOTP(entity);
        return hashOTP;
    };
    /** handle update OTP to database */
    handleUpdateOTP = async (entity) => {
        const _id = entity?.id;
        const data = { isBlocked: false, OTPRetry: 2, OTPCreatedTime: new Date(Date.now()) };
        const res = await this.OTPRepo.update(_id, data);
        return (0, either_1.success)(res);
    };
};
exports.VerifyOTPServiceImpl = VerifyOTPServiceImpl;
exports.VerifyOTPServiceImpl = VerifyOTPServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], VerifyOTPServiceImpl);
