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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
const _ = __importStar(require("lodash"));
// import projects
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const either_1 = require("../../../shared/common/either");
const Product_1 = require("../../../domain/models/products/Product");
const product_impl_1 = require("../../../infrastructure/repositories/products/product.impl");
let QueryServiceImpl = class QueryServiceImpl {
    // init repo
    productRepo;
    // constructor
    constructor() {
        this.productRepo = typedi_1.Container.get(product_impl_1.ProductRepositoryImpl);
    }
    // execute
    async execute(entity) {
        // handle query
        const resultQuery = await this.handleQuery(entity);
        if (resultQuery.isFailure())
            return (0, either_1.failure)(resultQuery.error);
        const _init = new Product_1.ProductModel();
        const result = _init.fromProductModelQuery(resultQuery.data);
        return (0, either_1.success)(result);
    }
    // processing feature
    handleQuery = async (req) => {
        const queryObj = { ...req.query };
        let optionsSize = {};
        // check id
        if (Object.keys(queryObj).includes('id')) {
            queryObj['_id'] = queryObj.id;
            _.unset(queryObj, ['id']);
        }
        // check query size and color
        if (Object.keys(queryObj).includes('size') ||
            Object.keys(queryObj).includes('color') ||
            Object.keys(queryObj).includes('sizeId')) {
            optionsSize = { size: queryObj?.size, color: queryObj?.color, _id: queryObj?.sizeId };
            _.unset(queryObj, ['size']);
            _.unset(queryObj, ['color']);
            _.unset(queryObj, ['sizeId']);
        }
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);
        // 1B) Advanced filtering
        let queryStr = JSON.stringify({ filter: queryObj, filterProductSize: optionsSize });
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        // execute query
        const res = await this.productRepo.find(JSON.parse(queryStr));
        if (!res.length)
            return (0, either_1.failure)(new appError_1.default('Not have products!', 400));
        return (0, either_1.success)(res);
    };
};
exports.QueryServiceImpl = QueryServiceImpl;
exports.QueryServiceImpl = QueryServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], QueryServiceImpl);
