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
exports.DeleteProductServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import projects
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const either_1 = require("../../../shared/common/either");
const product_impl_1 = require("../../../infrastructure/repositories/products/product.impl");
let DeleteProductServiceImpl = class DeleteProductServiceImpl {
    productRepo;
    // * constructor
    constructor() {
        this.productRepo = typedi_1.Container.get(product_impl_1.ProductRepositoryImpl);
    }
    /** overiding execute method */
    async execute(entity) {
        /** handle get product by id */
        const resultGet = await this.hanleGetProduct(entity?.params?.id);
        if (resultGet.isFailure())
            return (0, either_1.failure)(resultGet.error);
        /** get all product by id */
        const response = await this.productRepo.delete(entity?.params?.id);
        return (0, either_1.success)('okie');
    }
    /** handle get product by id */
    hanleGetProduct = async (id) => {
        const response = await this.productRepo.getById(id);
        if (!response)
            return (0, either_1.failure)(new appError_1.default('Not have product!', 400));
        return (0, either_1.success)(response);
    };
};
exports.DeleteProductServiceImpl = DeleteProductServiceImpl;
exports.DeleteProductServiceImpl = DeleteProductServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], DeleteProductServiceImpl);
