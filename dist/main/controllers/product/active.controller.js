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
exports.ActiveProductController = void 0;
const typedi_1 = require("typedi");
// * import projects
const catchAsync_1 = __importDefault(require("../../../shared/common/catchAsync"));
const active_1 = require("../../../domain/services/product/active");
// ==============================||  ACTIVE PRODUCT CONTROLLER ||============================== //
let ActiveProductController = class ActiveProductController {
    /** init services */
    activeProductService;
    // * constructor
    constructor() {
        this.activeProductService = typedi_1.Container.get(active_1.ActiveProductServiceImpl);
    }
    /** execute method */
    execute = (0, catchAsync_1.default)(async (req, res, next) => {
        /** execute service */
        const result = await this.activeProductService.execute(req);
        if (result.isFailure())
            return next(result.error);
        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Active product success',
            DT: {}
        });
    });
};
exports.ActiveProductController = ActiveProductController;
exports.ActiveProductController = ActiveProductController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], ActiveProductController);
