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
exports.UpdateCouponServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import projects
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const either_1 = require("../../../shared/common/either");
const coupon_impl_1 = require("../../../infrastructure/repositories/coupon.impl");
let UpdateCouponServiceImpl = class UpdateCouponServiceImpl {
    /** init service */
    couponRepo;
    constructor() {
        this.couponRepo = typedi_1.Container.get(coupon_impl_1.CouponRepositoryImpl);
    }
    /** execute function */
    async execute(entity) {
        /** get category from database */
        const resultGet = await this.handleGetCoupon(entity?.id);
        if (resultGet.isFailure())
            return (0, either_1.failure)(resultGet.error);
        const { data: coupon } = resultGet;
        const arrayAccountId = coupon?.accountIdExpires;
        arrayAccountId?.push(entity?.accountId);
        /** handle update coupon */
        const resultUpdate = await this.handelUpdateCoupon(entity?.id, {
            accountIdExpires: arrayAccountId
        });
        if (resultUpdate.isFailure())
            return (0, either_1.failure)(resultUpdate.error);
        return (0, either_1.success)(resultUpdate.data);
    }
    // * get coupon from database
    handleGetCoupon = async (id) => {
        const response = await this.couponRepo.getById(id);
        if (!response)
            return (0, either_1.failure)(new appError_1.default('Coupon is not exists!', 400));
        return (0, either_1.success)(response);
    };
    /** @todo: handle update coupon to database */
    handelUpdateCoupon = async (id, entity) => {
        const response = await this.couponRepo.update(id, entity);
        return (0, either_1.success)(response);
    };
};
exports.UpdateCouponServiceImpl = UpdateCouponServiceImpl;
exports.UpdateCouponServiceImpl = UpdateCouponServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], UpdateCouponServiceImpl);
