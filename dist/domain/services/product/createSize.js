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
exports.CreateProductSizeServiceImpl = void 0;
// import lib
const typedi_1 = __importStar(require("typedi"));
const either_1 = require("../../../shared/common/either");
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const product_impl_1 = require("../../../infrastructure/repositories/products/product.impl");
const size_impl_1 = require("../../../infrastructure/repositories/products/size.impl");
let CreateProductSizeServiceImpl = class CreateProductSizeServiceImpl {
    /** init service */
    productRepo;
    productSizeRepo;
    /** constructor */
    constructor() {
        this.productRepo = typedi_1.default.get(product_impl_1.ProductRepositoryImpl);
        this.productSizeRepo = typedi_1.default.get(size_impl_1.ProductSizeRepositoryImpl);
    }
    /** execute function */
    async execute(entity) {
        /** handle get product with id */
        const resultGet = await this.hanleGetProduct(entity?.body?.productId);
        if (resultGet.isFailure())
            return (0, either_1.failure)(resultGet.error);
        /** handle check type products */
        const resultCheckType = await this.handleCheckProductAdd(entity);
        if (resultCheckType.isFailure())
            return (0, either_1.failure)(resultCheckType.error);
        /** create product size */
        const response = await this.productSizeRepo.create({ ...entity?.body });
        /** handleUpdate product */
        const resUpdate = await this.handleUpdateProduct(entity, resultGet.data);
        if (resUpdate.isFailure())
            return (0, either_1.failure)(resUpdate.error);
        return (0, either_1.success)(response);
    }
    /**@todo: handle get product with id */
    hanleGetProduct = async (id) => {
        const response = await this.productRepo.getById(id);
        if (!response)
            return (0, either_1.failure)(new appError_1.default('Not have product!', 400));
        return (0, either_1.success)(response);
    };
    /** @todo: handle check size and color is exist in database */
    handleCheckProductAdd = async (entity) => {
        const res = await this.productSizeRepo.find({
            filter: { productId: entity?.body?.productId, size: entity?.body?.size, color: entity?.body?.color }
        });
        if (res.length)
            return (0, either_1.failure)(new appError_1.default('Product is exists in database!', 400));
        return (0, either_1.success)(true);
    };
    /** @todo: handle update product */
    handleUpdateProduct = async (entity, item) => {
        let _colors = [...item?.colors];
        let _sizes = [...item?.sizes];
        if (!item.colors?.includes(entity?.body?.color))
            _colors.push(entity?.body.color);
        if (!item.sizes?.includes(entity?.body?.color))
            _sizes.push(entity?.body.size);
        const res = await this.productRepo.update(item?.id, { colors: _colors, sizes: _sizes });
        return (0, either_1.success)(true);
    };
};
exports.CreateProductSizeServiceImpl = CreateProductSizeServiceImpl;
exports.CreateProductSizeServiceImpl = CreateProductSizeServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], CreateProductSizeServiceImpl);
