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
exports.GetProductByIdServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import projects
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const either_1 = require("../../../shared/common/either");
const Product_1 = require("../../../domain/models/products/Product");
const product_impl_1 = require("../../../infrastructure/repositories/products/product.impl");
let GetProductByIdServiceImpl = class GetProductByIdServiceImpl {
    productRepo;
    // * constructor
    constructor() {
        this.productRepo = typedi_1.Container.get(product_impl_1.ProductRepositoryImpl);
    }
    /** overiding execute method */
    async execute(entity) {
        /** get category by id */
        const resultGet = await this.handleGetProduct(entity?.params?.id);
        if (resultGet.isFailure())
            return (0, either_1.failure)(resultGet.error);
        const _init = new Product_1.ProductModel();
        const result = _init.fromProductModel(resultGet.data);
        return (0, either_1.success)(result);
    }
    // * get accoount from database
    handleGetProduct = async (id) => {
        const response = await this.productRepo.getById(id);
        // console.log('>>>Check res:', response);
        if (!response)
            return (0, either_1.failure)(new appError_1.default('Product is not already!', 400));
        return (0, either_1.success)(response);
    };
};
exports.GetProductByIdServiceImpl = GetProductByIdServiceImpl;
exports.GetProductByIdServiceImpl = GetProductByIdServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], GetProductByIdServiceImpl);
