"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
const _ = __importStar(require("lodash"));
// import projects
const either_1 = require("../../../shared/common/either");
const Product_1 = require("../../../domain/models/products/Product");
const product_impl_1 = require("../../../infrastructure/repositories/products/product.impl");
const size_impl_1 = require("../../../infrastructure/repositories/products/size.impl");
let FilterServiceImpl = class FilterServiceImpl {
    // init repo
    productRepo;
    productSizeRepo;
    // constructor
    constructor() {
        this.productRepo = typedi_1.Container.get(product_impl_1.ProductRepositoryImpl);
        this.productSizeRepo = typedi_1.Container.get(size_impl_1.ProductSizeRepositoryImpl);
    }
    // execute function
    async execute(entity) {
        let result = [];
        const _init = new Product_1.ProductModel();
        if (entity?.body?.categories.length || entity?.body?.colors.length) {
            const resultGet = await this.handleFeatures(entity);
            if (resultGet.isFailure())
                return (0, either_1.failure)(resultGet.error);
            result = _init.fromProductModelFilter(resultGet.data);
        }
        else {
            const response = await this.productRepo.getAll();
            result = _init.fromProductModelGetAll(response);
        }
        return (0, either_1.success)(result);
    }
    // handle features filter
    handleFeatures = async (req) => {
        const optionsSize = {
            filterCategories: { _id: { $in: req.body?.categories } },
            filterProductSize: { color: { $in: req.body?.colors } }
        };
        if (!req.body?.colors.length)
            _.unset(optionsSize, ['filterProductSize']);
        if (!req.body?.categories.length)
            _.unset(optionsSize, ['filterCategories']);
        let queryStrSize = JSON.stringify(optionsSize);
        queryStrSize = queryStrSize.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const resSize = await this.productRepo.find(JSON.parse(queryStrSize));
        return (0, either_1.success)(resSize);
    };
};
exports.FilterServiceImpl = FilterServiceImpl;
exports.FilterServiceImpl = FilterServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], FilterServiceImpl);
