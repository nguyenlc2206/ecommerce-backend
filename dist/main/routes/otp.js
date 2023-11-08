"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPRoutes = void 0;
const typedi_1 = require("typedi");
// * import projects
const index_1 = require("../../main/controllers/otp/index");
/** init controller */
const instance = typedi_1.Container.get(index_1.OTPController);
// console.log('>>>Check instance:', instance);
/** @todo: init routes */
const OTPRoutes = (router) => {
    // * verify otp
    router.post('/verify-otp', instance.verifyOTP);
};
exports.OTPRoutes = OTPRoutes;
