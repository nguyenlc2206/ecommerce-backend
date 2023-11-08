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
// * import projects
const env_1 = __importDefault(require("../../main/config/env"));
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
        const info = await this.createNewTransport().sendMail({
            from: `"Ecommerce 👻" <lcn@example.com>`,
            to: `${entity?.email}`,
            subject: 'OTP FOR CHANGE PASSWORD ✔',
            text: `Your OTP is ${entity?.OTP}`,
            html: `<b>Your OTP is ${entity?.OTP}</b>` // html body
        });
        return info;
    }
};
exports.Email = Email;
exports.Email = Email = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], Email);
