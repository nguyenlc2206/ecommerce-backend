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
exports.CreateCouponServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import projects
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const either_1 = require("../../../shared/common/either");
const Coupon_1 = require("../../../domain/models/Coupon");
const coupon_impl_1 = require("../../../infrastructure/repositories/coupon.impl");
const account_impl_1 = require("../../../infrastructure/repositories/account.impl");
let CreateCouponServiceImpl = class CreateCouponServiceImpl {
    /** init service */
    couponRepo;
    accountRepo;
    /** constructor */
    constructor() {
        this.couponRepo = typedi_1.Container.get(coupon_impl_1.CouponRepositoryImpl);
        this.accountRepo = typedi_1.Container.get(account_impl_1.AccountRepositoryImpl);
    }
    /** overiding execute method */
    async execute(entity) {
        /** init variables */
        const init = new Coupon_1.CouponModel();
        let resultCheck;
        /** check account */
        if (entity?.body?.accountId) {
            /** handle check code coupon */
            resultCheck = await this.handleGetCoupon(entity?.body?.code, 'personal', entity?.body?.accountId);
            if (resultCheck.isFailure())
                return (0, either_1.failure)(resultCheck.error);
            const account = await this.handleGetAccount(entity?.body?.accountId);
            if (account.isFailure())
                return (0, either_1.failure)(account.error);
        }
        else {
            /** handle check code coupon */
            resultCheck = await this.handleGetCoupon(entity?.body?.code, 'all');
            if (resultCheck.isFailure())
                return (0, either_1.failure)(resultCheck.error);
        }
        /** handle save coupon */
        const resultSave = await this.handleSaveCoupon(entity, init.fromCouponModel(resultCheck.data));
        if (resultSave.isFailure())
            return (0, either_1.failure)(resultSave.error);
        const result = init.fromCouponModel(resultSave.data);
        return (0, either_1.success)(result);
    }
    /** @todo: handle get account by id */
    handleGetAccount = async (id) => {
        const response = await this.accountRepo.getById(id);
        if (!response)
            return (0, either_1.failure)(new appError_1.default('Note have account!', 400));
        return (0, either_1.success)(response);
    };
    /** @todo: handle get coupon by code */
    handleGetCoupon = async (code, type, id) => {
        const response = await this.couponRepo.getByCode(code, type, id);
        if (response && response?.type === 'all')
            return (0, either_1.failure)(new appError_1.default('Coupon code is exists!', 400));
        return (0, either_1.success)(response);
    };
    /** @todo: handle save coupon */
    handleSaveCoupon = async (entity, coupon) => {
        let dataCreate = { ...entity?.body };
        // * check account
        if (entity?.body?.accountId) {
            dataCreate.type = 'personal';
            if (coupon?.account?.id === entity?.body?.accountId)
                return (0, either_1.failure)(new appError_1.default('Something wrong from accountId!', 400));
        }
        // * check time
        if (new Date(entity?.body?.startDate) > new Date(entity?.body?.endDate) ||
            new Date(entity?.body?.startDate) < new Date(Date.now()) ||
            new Date(entity?.body?.endDate) < new Date(Date.now())) {
            return (0, either_1.failure)(new appError_1.default('Something wrong from date!', 400));
        }
        /** save coupon */
        const result = await this.couponRepo.create(dataCreate);
        return (0, either_1.success)(result);
    };
};
exports.CreateCouponServiceImpl = CreateCouponServiceImpl;
exports.CreateCouponServiceImpl = CreateCouponServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], CreateCouponServiceImpl);
