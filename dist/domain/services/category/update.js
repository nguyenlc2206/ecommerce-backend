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
exports.UpdateCategoryServiceImpl = void 0;
// * import libs
const _ = __importStar(require("lodash"));
require("reflect-metadata");
const typedi_1 = require("typedi");
const fs_1 = __importDefault(require("fs"));
const either_1 = require("../../../shared/common/either");
const Category_1 = require("../../../domain/models/Category");
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const category_1 = require("../../../infrastructure/repositories/category");
const cloudinary_1 = require("../../../shared/common/cloudinary");
let UpdateCategoryServiceImpl = class UpdateCategoryServiceImpl {
    /** init repo */
    categoryRepo;
    cloudinary;
    /** constructor */
    constructor() {
        this.categoryRepo = typedi_1.Container.get(category_1.CategoryRepositoryImpl);
        this.cloudinary = typedi_1.Container.get(cloudinary_1.Cloudinary);
    }
    /** overiding execute */
    async execute(entity) {
        /** get category from database */
        const resultGet = await this.handleGetCategory(entity?.params.id);
        if (resultGet.isFailure())
            return (0, either_1.failure)(resultGet.error);
        const { data: category } = resultGet;
        /** handle update image */
        let _entity = {};
        if (entity?.file) {
            const resultImage = await this.handleUpdateImage(entity, category);
            if (resultImage.isFailure())
                return (0, either_1.failure)(resultImage.error);
            _entity = resultImage.data;
        }
        /** handle update data */
        _.omit(entity?.body, ['image']);
        const reponse = await this.categoryRepo.update(category?.id, {
            ...entity?.body,
            name: entity?.body?.name.toUpperCase(),
            ..._entity
        });
        const _init = new Category_1.CategoryModel();
        const result = _init.fromCategoryModel(reponse);
        return (0, either_1.success)(result);
    }
    // * get category from database
    handleGetCategory = async (id) => {
        const response = await this.categoryRepo.getById(id);
        if (!response)
            return (0, either_1.failure)(new appError_1.default('Category is not exists!', 400));
        return (0, either_1.success)(response);
    };
    //* handle cloudinary iamge
    handleGetLinkImage = async (params) => {
        const response = await this.cloudinary.uploadImage(params);
        return (0, either_1.success)(response?.url);
    };
    /** handle update image */
    handleUpdateImage = async (entity, category) => {
        let img = fs_1.default.readFileSync(entity?.file?.path);
        const params = {
            database64: 'data:image/png;base64,' + img.toString('base64'),
            package: 'CategoryImages',
            publicId: category?.name === entity?.body?.name.toLocaleLowerCase()
                ? category?.name
                : entity?.body?.name.toLocaleLowerCase()
        };
        const resImage = await this.handleGetLinkImage(params);
        if (resImage.isFailure())
            return (0, either_1.failure)(resImage.error);
        const _entity = { image: resImage.data };
        return (0, either_1.success)(_entity);
    };
};
exports.UpdateCategoryServiceImpl = UpdateCategoryServiceImpl;
exports.UpdateCategoryServiceImpl = UpdateCategoryServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], UpdateCategoryServiceImpl);
