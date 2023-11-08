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
exports.CreateAccountController = void 0;
const typedi_1 = require("typedi");
// * import projects
const catchAsync_1 = __importDefault(require("../../../shared/common/catchAsync"));
const create_1 = require("../../../domain/services/account/create");
const create_2 = require("../../../main/controllers/validations/account/create");
// ==============================||  CREATE ACCOUNT CONTROLLER ||============================== //
let CreateAccountController = class CreateAccountController {
    validation = new create_2.ValidationCreateAccount();
    createAccountService;
    // * constructor
    constructor() {
        this.createAccountService = typedi_1.Container.get(create_1.CreateAccountServiceImpl);
    }
    /** execute method */
    execute = (0, catchAsync_1.default)(async (req, res, next) => {
        // * validations fields
        const validations = this.validation.execute(req);
        if (validations)
            return next(validations);
        // * execute account services
        let data = { ...req.body, file: { ...req.file } };
        const result = await this.createAccountService.execute(data);
        if (result.isFailure())
            return next(result.error);
        const { data: account } = result;
        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Insert user to database success',
            DT: { data: account }
        });
    });
};
exports.CreateAccountController = CreateAccountController;
exports.CreateAccountController = CreateAccountController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], CreateAccountController);
