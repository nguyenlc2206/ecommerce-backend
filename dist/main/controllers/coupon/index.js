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
exports.CouponController = void 0;
// * import libs
const typedi_1 = require("typedi");
// * import projects
const create_controller_1 = require("../../../main/controllers/coupon/create.controller");
const discount_controller_1 = require("../../../main/controllers/coupon/discount.controller");
const getAll_controller_1 = require("../../../main/controllers/coupon/getAll.controller");
const delete_controller_1 = require("../../../main/controllers/coupon/delete.controller");
const active_controller_1 = require("../../../main/controllers/coupon/active.controller");
// ==============================|| CREATE COUPON CONTROLLER ||============================== //
let CouponController = class CouponController {
    /** constructor */
    constructor() { }
    /** create method */
    create = async (req, res, next) => {
        const _init = new create_controller_1.CreateCouponController();
        return _init.execute(req, res, next);
    };
    /** discount method */
    discount = async (req, res, next) => {
        const _init = new discount_controller_1.DiscountController();
        return _init.execute(req, res, next);
    };
    // * get all categories
    getAll = async (req, res, next) => {
        const _init = new getAll_controller_1.GetAllCouponController();
        return _init.execute(req, res, next);
    };
    /** delete method */
    delete = async (req, res, next) => {
        const _init = new delete_controller_1.DeleteCouponController();
        return _init.execute(req, res, next);
    };
    // * active method
    active = async (req, res, next) => {
        const _init = new active_controller_1.ActiveCouponController();
        return _init.execute(req, res, next);
    };
};
exports.CouponController = CouponController;
exports.CouponController = CouponController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], CouponController);
