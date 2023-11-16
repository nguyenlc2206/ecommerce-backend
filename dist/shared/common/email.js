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
exports.Email = void 0;
// * import libs
const typedi_1 = require("typedi");
const nodemailer_1 = require("nodemailer");
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
// * import projects
const env_1 = __importDefault(require("../../main/config/env"));
const format_1 = require("../../shared/common/format");
let Email = class Email {
    /** constructor */
    constructor() { }
    /** create new transport */
    createNewTransport() {
        return (0, nodemailer_1.createTransport)({
            host: env_1.default.emailHost,
            port: env_1.default.emailPort,
            auth: {
                user: env_1.default.emailUsername,
                pass: env_1.default.emailPassword
            }
        });
    }
    /** overding sendEmailChangePassword method */
    async sendEmailChangePassword(entity) {
        const template = fs_1.default.readFileSync(`${process.cwd()}/src/shared/templates/sendOTP.html`, 'utf8');
        const compiledTemplate = handlebars_1.default.compile(template);
        const html = compiledTemplate(entity);
        const info = await this.createNewTransport().sendMail({
            from: `"Ecommerce 👻" <ecommerce.app@example.com>`,
            to: `${entity?.email}`,
            subject: 'OTP FOR CHANGE PASSWORD ✔',
            html: `${html}` // html body
        });
        return info;
    }
    /** overding sendEmailSupport method */
    async sendEmailSupport(entity) {
        const template = fs_1.default.readFileSync(`${process.cwd()}/src/shared/templates/support.html`, 'utf8');
        const compiledTemplate = handlebars_1.default.compile(template);
        const html = compiledTemplate(entity);
        const info = await this.createNewTransport().sendMail({
            from: `${entity?.email}`,
            to: `"Ecommerce 👻" <ecommerce.app@example.com>`,
            subject: 'OTP FOR CHANGE PASSWORD ✔',
            html: `${html}` // html body
        });
        return info;
    }
    /** overding sendEmailConfirmOrder method */
    async sendEmailConfirmOrder(entity) {
        const template = fs_1.default.readFileSync(`${process.cwd()}/src/shared/templates/confirmOrder.html`, 'utf8');
        const compiledTemplate = handlebars_1.default.compile(template);
        // register helper if need
        handlebars_1.default.registerHelper('formatDate', function (date) {
            return (0, format_1.formatDate)(date);
        });
        handlebars_1.default.registerHelper('cacularPrice', function (num1, num2) {
            return num1 * (1 - num2 / 100);
        });
        handlebars_1.default.registerHelper('cacularOneProduct', function (num1, num2, num3) {
            return num1 * (1 - num2 / 100) * num3;
        });
        let total = 0;
        handlebars_1.default.registerHelper('cacularTotalPrice', function (items) {
            items.map((item) => {
                total = total + item?.price * (1 - item?.discount / 100) * item?.qty;
            });
            return total;
        });
        let coupon = 0;
        handlebars_1.default.registerHelper('cacularTotalCoupon', function (items) {
            items.map((item) => {
                coupon = coupon + item?.price * (entity?.dicount || 0 / 100) * item?.qty;
            });
            return coupon;
        });
        handlebars_1.default.registerHelper('addTwoNumAndFormatCurrency', function () {
            return total - coupon;
        });
        console.log(entity);
        const html = compiledTemplate(entity);
        const info = await this.createNewTransport().sendMail({
            from: `"Ecommerce 👻" <ecommerce.app@example.com>`,
            to: `${entity?.email}`,
            subject: 'ORDER CONFIRM INFORMATION ✔',
            html: `${html}` // html body
        });
        return info;
    }
};
exports.Email = Email;
exports.Email = Email = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], Email);
