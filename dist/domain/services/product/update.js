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
exports.UpdateProductServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
const fs_1 = __importDefault(require("fs"));
// * import projects
const either_1 = require("../../../shared/common/either");
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const size_impl_1 = require("../../../infrastructure/repositories/products/size.impl");
const product_impl_1 = require("../../../infrastructure/repositories/products/product.impl");
const cloudinary_1 = require("../../../shared/common/cloudinary");
let UpdateProductServiceImpl = class UpdateProductServiceImpl {
    /** init services */
    cloudinary;
    productRepo;
    productSizeRepo;
    constructor() {
        this.cloudinary = typedi_1.Container.get(cloudinary_1.Cloudinary);
        this.productRepo = typedi_1.Container.get(product_impl_1.ProductRepositoryImpl);
        this.productSizeRepo = typedi_1.Container.get(size_impl_1.ProductSizeRepositoryImpl);
    }
    /** execute function */
    async execute(entity) {
        /** handle get product */
        const resultGet = await this.handleGetProduct(entity?.params?.id);
        if (resultGet.isFailure())
            return (0, either_1.failure)(resultGet.error);
        /** handle processing image */
        let images = [];
        if (entity?.files) {
            /** handle get array link images */
            const resultImages = await this.handleGetLinkImage(entity?.files, resultGet.data);
            if (resultImages.isFailure())
                return (0, either_1.failure)(resultImages.error);
            images = resultImages.data;
        }
        /** handle update */
        const response = await this.productRepo.update(entity?.params?.id, { ...entity?.body, images: images });
        return (0, either_1.success)(response);
    }
    /** @todo: handle get product */
    handleGetProduct = async (id) => {
        const res = await this.productRepo.getById(id);
        if (!res)
            return (0, either_1.failure)(new appError_1.default('Product id is not exists!', 400));
        return (0, either_1.success)(res);
    };
    //* handle cloudinary iamge
    handleGetLinkImage = async (data, product) => {
        /** init  */
        const result = [];
        let params = {};
        product.images?.map(async (url, index) => {
            const lastItem = url.split('/').pop();
            const publicId = lastItem?.split('.')[0];
            if (data?.id === publicId) {
                let img = fs_1.default.readFileSync(data?.file?.path);
                params = {
                    database64: 'data:image/png;base64,' + img.toString('base64'),
                    package: 'ProductImages',
                    publicId: data?.id
                };
                const response = await this.cloudinary.uploadImage(params);
                product.images[index] = response?.url;
            }
        });
        return (0, either_1.success)([...product.images, ...result]);
    };
};
exports.UpdateProductServiceImpl = UpdateProductServiceImpl;
exports.UpdateProductServiceImpl = UpdateProductServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], UpdateProductServiceImpl);
