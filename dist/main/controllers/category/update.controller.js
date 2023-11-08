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
exports.UpdateCategoryController = void 0;
const typedi_1 = require("typedi");
// * import projects
const catchAsync_1 = __importDefault(require("../../../shared/common/catchAsync"));
const update_1 = require("../../../domain/services/category/update");
const update_2 = require("../../../main/controllers/validations/category/update");
// ==============================||  UPDATE CATEGORY CONTROLLER ||============================== //
let UpdateCategoryController = class UpdateCategoryController {
    /** init services */
    updateCategoryService;
    validation = new update_2.ValidationUpdateCategory();
    /** constructor */
    constructor() {
        this.updateCategoryService = typedi_1.Container.get(update_1.UpdateCategoryServiceImpl);
    }
    /** overding execute function */
    execute = (0, catchAsync_1.default)(async (req, res, next) => {
        /** validation */
        const validation = this.validation.execute(req);
        if (validation)
            return next(validation);
        /** execute create category */
        const response = await this.updateCategoryService.execute(req);
        if (response.isFailure())
            return next(response.error);
        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Update category to database success',
            DT: { data: {} }
        });
    });
};
exports.UpdateCategoryController = UpdateCategoryController;
exports.UpdateCategoryController = UpdateCategoryController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], UpdateCategoryController);
