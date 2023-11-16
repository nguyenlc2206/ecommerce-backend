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
exports.SendEmailSupportController = void 0;
const typedi_1 = require("typedi");
// * import projects
const catchAsync_1 = __importDefault(require("../../../shared/common/catchAsync"));
const email_1 = require("../../../shared/common/email");
const support_1 = require("../../../main/controllers/validations/email/support");
// ==============================||  SEND EMAIL CONTROLLER ||============================== //
let SendEmailSupportController = class SendEmailSupportController {
    /** init validation */
    emailService;
    validation = new support_1.ValidationSupportEmail();
    // * constructor
    constructor() {
        this.emailService = typedi_1.Container.get(email_1.Email);
    }
    /** execute method */
    execute = (0, catchAsync_1.default)(async (req, res, next) => {
        // * validations fields
        const valitions = this.validation.execute(req);
        if (valitions)
            return next(valitions);
        //* execute service
        const response = await this.emailService.sendEmailSupport({
            email: req?.body?.email,
            supportText: req?.body?.supportText
        });
        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Send email success!',
            DT: {}
        });
    });
};
exports.SendEmailSupportController = SendEmailSupportController;
exports.SendEmailSupportController = SendEmailSupportController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], SendEmailSupportController);
