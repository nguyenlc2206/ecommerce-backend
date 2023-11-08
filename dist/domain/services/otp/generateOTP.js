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
exports.GenerateOTPServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import projects
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const either_1 = require("../../../shared/common/either");
const email_1 = require("../../../shared/common/email");
const otp_1 = require("../../../shared/common/otp");
const account_impl_1 = require("../../../infrastructure/repositories/account.impl");
const OTP_1 = require("../../../domain/models/OTP");
const otp_impl_1 = require("../../../infrastructure/repositories/otp.impl");
let GenerateOTPServiceImpl = class GenerateOTPServiceImpl {
    /** init service and repo */
    emailService;
    OTPRepo;
    OTPService;
    accountRepo;
    // * constructor
    constructor() {
        this.emailService = typedi_1.Container.get(email_1.Email);
        this.OTPService = typedi_1.Container.get(otp_1.OTPService);
        this.OTPRepo = typedi_1.Container.get(otp_impl_1.OTPRepositoryImpl);
        this.accountRepo = typedi_1.Container.get(account_impl_1.AccountRepositoryImpl);
    }
    /** overiding execute method */
    async execute(entity) {
        // * get account by email
        const resultGet = await this.handleGetAccountByEmail(entity?.email);
        if (resultGet.isFailure())
            return (0, either_1.failure)(resultGet.error);
        const { data: account } = resultGet;
        // * get OTP by accountId and typeOTP
        const resultGetOTP = await this.handleGetOTPInfo(account?.id, 'OTPForgotPassword');
        if (resultGetOTP.isFailure())
            return (0, either_1.failure)(resultGetOTP.error);
        const { data: OTPInfo } = resultGetOTP;
        // * generate OTP
        const OTP = await this.OTPService.generateOTP();
        // * hash OTP
        const resultHash = await this.handleHashOTP(account?.phoneNo, OTP);
        // console.log('>>>Check resultHash:', resultHash);
        let resultOTP;
        if (!resultGetOTP.data) {
            // * handle save OTP to database
            resultOTP = await this.handleSaveOTP(account, resultHash);
            if (resultOTP.isFailure())
                return (0, either_1.failure)(resultOTP.error);
        }
        else {
            // * handle update OTP to database
            resultOTP = await this.handleUpdateOTP(OTPInfo, resultHash);
            if (resultOTP.isFailure())
                return (0, either_1.failure)(resultOTP.error);
        }
        // * proccesing result
        const _initOTPModel = new OTP_1.OTPModel();
        const result = _initOTPModel.fromOTPModelToChangePassword(resultOTP.data, account?.email);
        //* send email
        if ((OTPInfo?.OTPRetry && OTPInfo?.OTPRetry > 0) || !resultGetOTP.data) {
            const resultSend = this.handleSendOTP(account, OTP);
            if (resultSend.isFailure())
                return (0, either_1.failure)(resultSend.error);
        }
        return (0, either_1.success)(result);
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
        // If account OTP is blocked, return an error
        if (res?.isBlocked && res?.blockUntil) {
            const currentTime = new Date(Date.now());
            if (currentTime < res?.blockUntil) {
                return (0, either_1.failure)(new appError_1.default('Account blocked. Try after some time.', 403));
            }
        }
        // Check for minimum 1-minute gap between OTP requests
        const lastOTPTime = res?.OTPCreatedTime.getTime();
        const currentTime = new Date(Date.now()).getTime();
        if (lastOTPTime && currentTime - lastOTPTime < 60000) {
            return (0, either_1.failure)(new appError_1.default('Minimum 1-minute gap required between OTP requests', 403));
        }
        return (0, either_1.success)(res);
    };
    /** @todo: generate OTP and send to customer */
    handleSendOTP = (entity, OTP) => {
        const _entity = { email: entity?.email, OTP: OTP };
        const res = this.emailService.sendEmailChangePassword(_entity);
        return (0, either_1.success)(entity);
    };
    /** @todo: hash OTP to save database */
    handleHashOTP = async (phone, otp) => {
        const entity = {
            expiresAfter: 5,
            phone: phone,
            otp: otp,
            key: 'verysecret'
        };
        const hashOTP = await this.OTPService.createNewOTP(entity);
        return hashOTP;
    };
    /** handle save OTP to database */
    handleSaveOTP = async (entity, OTP) => {
        const data = {
            accountId: entity?.id,
            OTP: OTP,
            OTPCreatedTime: new Date(Date.now()),
            OTPType: 'OTPForgotPassword'
        };
        const res = await this.OTPRepo.create(data);
        return (0, either_1.success)(res);
    };
    /** handle update OTP to database */
    handleUpdateOTP = async (entity, OTP) => {
        const _id = entity?.id;
        let data = {};
        // * check retry OTP times
        if (entity?.OTPRetry === 1) {
            const blockUntil = new Date(Date.now());
            blockUntil.setHours(blockUntil.getHours() + 1);
            data = {
                isBlocked: true,
                blockUntil: blockUntil,
                OTPRetry: entity?.OTPRetry - 1,
                OTP: OTP,
                OTPCreatedTime: new Date(Date.now())
            };
        }
        else if (entity?.OTPRetry) {
            data = { OTPRetry: entity?.OTPRetry - 1, OTP: OTP, OTPCreatedTime: new Date(Date.now()) };
        }
        const res = await this.OTPRepo.update(_id, data);
        return (0, either_1.success)(res);
    };
};
exports.GenerateOTPServiceImpl = GenerateOTPServiceImpl;
exports.GenerateOTPServiceImpl = GenerateOTPServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], GenerateOTPServiceImpl);
