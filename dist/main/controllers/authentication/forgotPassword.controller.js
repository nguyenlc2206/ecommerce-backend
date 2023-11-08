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
exports.ForgotPasswordController = void 0;
const typedi_1 = require("typedi");
// * import projects
const catchAsync_1 = __importDefault(require("../../../shared/common/catchAsync"));
const forgotPassword_1 = require("../../../main/controllers/validations/authentication/forgotPassword");
const generateOTP_1 = require("../../../domain/services/otp/generateOTP");
// ==============================||  FORGOT PASSWORD CONTROLLER ||============================== //
let ForgotPasswordController = class ForgotPasswordController {
    validation = new forgotPassword_1.ValidationForgotPassword();
    generateOTPService;
    // * constructor
    constructor() {
        this.generateOTPService = typedi_1.Container.get(generateOTP_1.GenerateOTPServiceImpl);
    }
    // * execute function
    execute = (0, catchAsync_1.default)(async (req, res, next) => {
        // * validation fields
        const validation = this.validation.execute(req);
        if (validation)
            return next(validation);
        // * execute forgot password service
        const data = { ...req.body };
        const result = await this.generateOTPService.execute(data);
        if (result.isFailure())
            return next(result.error);
        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: `Send OTP to email ${req.body?.email} success`,
            DT: { data: result.data }
        });
    });
};
exports.ForgotPasswordController = ForgotPasswordController;
exports.ForgotPasswordController = ForgotPasswordController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], ForgotPasswordController);
