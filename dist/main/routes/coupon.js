"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoutes = void 0;
const typedi_1 = require("typedi");
// * import projects
const authentication_1 = require("../../main/controllers/authentication");
const middleware_1 = __importDefault(require("../../shared/common/middleware"));
const coupon_1 = require("../../main/controllers/coupon");
/** init controller */
const instanceCoupon = typedi_1.Container.get(coupon_1.CouponController);
const instanceAuth = typedi_1.Container.get(authentication_1.AuthenticationController);
/** @todo: init routes */
const CouponRoutes = (router) => {
    // * create coupon
    router.post('/coupon', instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceCoupon.create);
    // * discount coupon
    router.post('/discount', instanceAuth.protect, instanceCoupon.discount);
    /** getAll method */
    router.get('/coupon/getAll', instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceCoupon.getAll);
    /** delete method */
    router.delete('/coupon/:id', instanceAuth.protect, (0, middleware_1.default)(['admin']), instanceCoupon.delete);
};
exports.CouponRoutes = CouponRoutes;
