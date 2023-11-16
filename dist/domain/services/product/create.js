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
exports.CreateProductServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const _ = __importStar(require("lodash"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const typedi_1 = require("typedi");
// * import projects
const either_1 = require("../../../shared/common/either");
const Product_1 = require("../../../domain/models/products/Product");
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const cloudinary_1 = require("../../../shared/common/cloudinary");
const product_impl_1 = require("../../../infrastructure/repositories/products/product.impl");
const size_impl_1 = require("../../../infrastructure/repositories/products/size.impl");
const category_1 = require("../../../infrastructure/repositories/category");
let CreateProductServiceImpl = class CreateProductServiceImpl {
    /** init repo, store */
    cloudinary;
    productRepo;
    productSizeRepo;
    categoryRepo;
    /** constructor */
    constructor() {
        this.cloudinary = typedi_1.Container.get(cloudinary_1.Cloudinary);
        this.productRepo = typedi_1.Container.get(product_impl_1.ProductRepositoryImpl);
        this.productSizeRepo = typedi_1.Container.get(size_impl_1.ProductSizeRepositoryImpl);
        this.categoryRepo = typedi_1.Container.get(category_1.CategoryRepositoryImpl);
    }
    /** execute function */
    async execute(entity) {
        /** handle check category */
        const resultGet = await this.handleGetCategory(entity?.body?.categoryId);
        if (resultGet.isFailure())
            return (0, either_1.failure)(resultGet.error);
        /** save product */
        const result = await this.hanleSaveProduct(entity);
        if (result.isFailure())
            return (0, either_1.failure)(result.error);
        /** handle save product size */
        const resultSave = this.handleSaveProductSize(entity, result?.data?.id);
        return (0, either_1.success)(result.data);
    }
    /** @todo: handle check category */
    handleGetCategory = async (id) => {
        const result = await this.categoryRepo.getById(id);
        if (!result)
            return (0, either_1.failure)(new appError_1.default('Category is not exists!', 400));
        return (0, either_1.success)(true);
    };
    /** @todo: save product */
    hanleSaveProduct = async (entity) => {
        /** handle get array link images */
        const images = await this.handleGetLinkImage(entity?.files);
        if (images.isFailure())
            return (0, either_1.failure)(images.error);
        /** processing sizes */
        const sizes = [];
        const colors = [];
        entity?.body?.sizes.map((item) => {
            const _item = JSON.parse(item);
            if (!sizes.includes(_item?.size))
                sizes.push(_item?.size);
            if (!colors.includes(_item?.color))
                colors.push(_item?.color);
        });
        /** handle save product */
        const dataCreate = {
            ...entity?.body,
            sizes: sizes,
            colors: colors,
            images: images.data,
            accountId: entity?.account?.id
        };
        // const dataCreate = { ...entity?.body, sizes: sizes, accountId: entity?.account?.id };
        const response = await this.productRepo.create(dataCreate);
        const _init = new Product_1.ProductModel();
        const result = _init.fromProductModel(response);
        return (0, either_1.success)(_.omit(result, 'category'));
    };
    /** @todo: processing images */
    handleGetLinkImage = async (data) => {
        /** init  */
        const result = [];
        await Promise.all(data.map(async (item) => {
            let img = fs_1.default.readFileSync(item.path);
            const params = {
                database64: 'data:image/png;base64,' + img.toString('base64'),
                package: 'ProductImages',
                publicId: (0, uuid_1.v4)()
            };
            const response = await this.cloudinary.uploadImage(params);
            result.push(response?.url);
        }));
        return (0, either_1.success)(result);
    };
    /** @todo: handle save product size */
    handleSaveProductSize = async (entity, id) => {
        const productSize = [];
        entity?.body?.sizes.map((item) => {
            const _item = JSON.parse(item);
            productSize.push({
                ..._item,
                productId: id
            });
        });
        const resultSize = await this.productSizeRepo.insertMary(productSize);
        return (0, either_1.success)(resultSize);
    };
};
exports.CreateProductServiceImpl = CreateProductServiceImpl;
exports.CreateProductServiceImpl = CreateProductServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], CreateProductServiceImpl);
