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
exports.EmailController = void 0;
// * import libs
const typedi_1 = require("typedi");
// * import projects
const support_controller_1 = require("../../../main/controllers/email/support.controller");
// ==============================|| EMAIL CONTROLLER ||============================== //
let EmailController = class EmailController {
    /** constructor */
    constructor() { }
    /** create method */
    support = async (req, res, next) => {
        const _init = new support_controller_1.SendEmailSupportController();
        return _init.execute(req, res, next);
    };
};
exports.EmailController = EmailController;
exports.EmailController = EmailController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], EmailController);
