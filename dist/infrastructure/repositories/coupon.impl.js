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
exports.CouponRepositoryImpl = void 0;
// * import lib
const typedi_1 = require("typedi");
const Coupon_1 = __importDefault(require("../../infrastructure/schema/Coupon"));
// ==============================||  COUPON REPOSITORY IMPLEMENT ||============================== //
let CouponRepositoryImpl = class CouponRepositoryImpl {
    /** constructor */
    constructor() { }
    /** overiding create method */
    async create(entity) {
        const result = await new Coupon_1.default(entity).save();
        return result;
    }
    /** overiding getById method */
    async getById(id) {
        const result = await Coupon_1.default.findById(id);
        return result;
    }
    /** overiding delete method */
    async delete(id) {
        const result = await Coupon_1.default.findById(id);
        if (result) {
            result.isDeleted = true;
            result.deletedAt = new Date(Date.now());
            await result.save();
        }
    }
    /** overiding getAll method */
    async getAll() {
        const result = await Coupon_1.default.find();
        return result;
    }
    /** overiding update method */
    async update(id, entity) {
        const result = await Coupon_1.default.findByIdAndUpdate(id, entity);
        return result;
    }
    /** overiding getByCode method */
    async getByCode(code, type, id) {
        const popObj = {
            path: 'accountId',
            select: 'id'
        };
        const result = await Coupon_1.default.findOne({ code: code, type: type, accountId: id }).populate(popObj);
        return result;
    }
    /** overiding get discount method */
    async getDiscountByCode(code) {
        const popObj = {
            path: 'accountId',
            select: 'id'
        };
        const result = await Coupon_1.default.findOne({ code: code }).populate(popObj);
        return result;
    }
};
exports.CouponRepositoryImpl = CouponRepositoryImpl;
exports.CouponRepositoryImpl = CouponRepositoryImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], CouponRepositoryImpl);
