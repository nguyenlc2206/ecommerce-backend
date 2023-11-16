"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// * import lib
const express_1 = require("express");
// * import projects
const otp_1 = require("../../main/routes/otp");
const account_1 = require("../../main/routes/account");
const authentication_1 = require("../../main/routes/authentication");
const category_1 = require("../../main/routes/category");
const product_1 = require("../../main/routes/product");
const order_1 = require("../../main/routes/order");
const coupon_1 = require("../../main/routes/coupon");
const email_1 = require("../../main/routes/email");
/** @todo: setup configs routes express */
const ExpressRoutes = (app) => {
    const routes = [
        authentication_1.AuthenticationRoutes,
        account_1.AccountRoutes,
        otp_1.OTPRoutes,
        category_1.CategoryRoutes,
        product_1.ProductRoutes,
        order_1.OrderRoutes,
        coupon_1.CouponRoutes,
        email_1.EmailRoutes
    ];
    /** init router */
    const router = (0, express_1.Router)();
    app.use('/api/v1', router);
    routes.forEach((route) => route(router));
};
exports.default = ExpressRoutes;
