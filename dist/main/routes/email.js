"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailRoutes = void 0;
const typedi_1 = require("typedi");
// * import projects
const email_1 = require("../../main/controllers/email");
/** init controller */
const instance = typedi_1.Container.get(email_1.EmailController);
// console.log('>>>Check instance:', instance);
/** @todo: init routes */
const EmailRoutes = (router) => {
    // * verify otp
    router.post('/email-support', instance.support);
};
exports.EmailRoutes = EmailRoutes;
