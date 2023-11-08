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
exports.UpdateAccountController = void 0;
const typedi_1 = require("typedi");
// * import projects
const catchAsync_1 = __importDefault(require("../../../shared/common/catchAsync"));
const update_1 = require("../validations/account/update");
const update_2 = require("../../../domain/services/account/update");
// ==============================||  UPDATE ACCOUNT CONTROLLER ||============================== //
let UpdateAccountController = class UpdateAccountController {
    /** init service */
    validation = new update_1.ValidationUpdateAccount();
    updateAccountService;
    // * constructor
    constructor() {
        this.updateAccountService = typedi_1.Container.get(update_2.UpdateAccountServiceImpl);
    }
    /** execute method */
    execute = (0, catchAsync_1.default)(async (req, res, next) => {
        // * validations fields
        const validations = this.validation.execute(req);
        if (validations)
            return next(validations);
        // * update execute
        const result = await this.updateAccountService.execute(req);
        if (result.isFailure())
            return next(result.error);
        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Update account to database success',
            DT: { data: result.data }
        });
    });
};
exports.UpdateAccountController = UpdateAccountController;
exports.UpdateAccountController = UpdateAccountController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], UpdateAccountController);
