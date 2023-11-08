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
exports.UpdateProductController = void 0;
const typedi_1 = require("typedi");
// * import projects
const catchAsync_1 = __importDefault(require("../../../shared/common/catchAsync"));
const update_1 = require("../../../main/controllers/validations/product/update");
const update_2 = require("../../../domain/services/product/update");
// ==============================||  UPDATE PRODUCT CONTROLLER ||============================== //
let UpdateProductController = class UpdateProductController {
    /** init validation */
    validation = new update_1.ValidationUpdateProduct();
    updateProductService;
    // * constructor
    constructor() {
        this.updateProductService = typedi_1.Container.get(update_2.UpdateProductServiceImpl);
    }
    /** execute method */
    execute = (0, catchAsync_1.default)(async (req, res, next) => {
        // * validations fields
        const validation = this.validation.execute(req);
        if (validation)
            return next(validation);
        // * execute update product services
        const response = await this.updateProductService.execute(req);
        if (response.isFailure())
            return next(response.error);
        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Update product to database success',
            DT: { data: {} }
        });
    });
};
exports.UpdateProductController = UpdateProductController;
exports.UpdateProductController = UpdateProductController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], UpdateProductController);
