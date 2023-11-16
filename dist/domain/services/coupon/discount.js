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
exports.DiscountServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import projects
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const either_1 = require("../../../shared/common/either");
const Coupon_1 = require("../../../domain/models/Coupon");
const coupon_impl_1 = require("../../../infrastructure/repositories/coupon.impl");
let DiscountServiceImpl = class DiscountServiceImpl {
    /** init service */
    couponRepo;
    /** constructor */
    constructor() {
        this.couponRepo = typedi_1.Container.get(coupon_impl_1.CouponRepositoryImpl);
    }
    /** overiding execute method */
    async execute(entity) {
        /** handle get discount */
        const resultGet = await this.handleGetDiscount(entity);
        if (resultGet.isFailure())
            return (0, either_1.failure)(resultGet.error);
        const _init = new Coupon_1.CouponModel();
        const result = _init.fromCouponModelDiscount(resultGet.data);
        return (0, either_1.success)(result);
    }
    /** @todo: get discount */
    handleGetDiscount = async (req) => {
        const coupon = await this.couponRepo.getDiscountByCode(req?.body?.codes);
        // check code active
        if (coupon?.isDeleted)
            return (0, either_1.failure)(new appError_1.default('Code is not active!', 400));
        // check code is used
        if (coupon.accountIdExpires?.includes(req?.accountId))
            return (0, either_1.failure)(new appError_1.default('Code is used!', 400));
        // check coupon expires
        if (new Date(coupon?.endDate) < new Date(Date.now()))
            return (0, either_1.failure)(new appError_1.default('Code is expires!', 400));
        const _init = new Coupon_1.CouponModel();
        const result = _init.fromCouponModel(coupon);
        // check code wrong
        if (coupon?.type === 'personal' && result?.account?.id !== req?.accountId) {
            return (0, either_1.failure)(new appError_1.default('Code is wrong!', 400));
        }
        // check code is use
        if (coupon?.isDeleted)
            return (0, either_1.failure)(new appError_1.default('Code is used!', 400));
        return (0, either_1.success)(coupon);
    };
};
exports.DiscountServiceImpl = DiscountServiceImpl;
exports.DiscountServiceImpl = DiscountServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], DiscountServiceImpl);
