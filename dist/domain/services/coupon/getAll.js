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
exports.GetAllCouponServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import projects
const either_1 = require("../../../shared/common/either");
const Coupon_1 = require("../../../domain/models/Coupon");
const coupon_impl_1 = require("../../../infrastructure/repositories/coupon.impl");
let GetAllCouponServiceImpl = class GetAllCouponServiceImpl {
    couponRepo;
    // * constructor
    constructor() {
        this.couponRepo = typedi_1.Container.get(coupon_impl_1.CouponRepositoryImpl);
    }
    /** overiding execute method */
    async execute() {
        /** get all category by id */
        const response = await this.couponRepo.getAll();
        const _init = new Coupon_1.CouponModel();
        const result = _init.fromCouponModelGetAll(response);
        return (0, either_1.success)(result);
    }
};
exports.GetAllCouponServiceImpl = GetAllCouponServiceImpl;
exports.GetAllCouponServiceImpl = GetAllCouponServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], GetAllCouponServiceImpl);
