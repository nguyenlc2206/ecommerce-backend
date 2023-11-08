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
exports.CreateCategoryServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
const fs_1 = __importDefault(require("fs"));
// * import projects
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const either_1 = require("../../../shared/common/either");
const Category_1 = require("../../../domain/models/Category");
const cloudinary_1 = require("../../../shared/common/cloudinary");
const category_1 = require("../../../infrastructure/repositories/category");
let CreateCategoryServiceImpl = class CreateCategoryServiceImpl {
    /** init repository */
    categoryRepo;
    cloudinary;
    /** constructor */
    constructor() {
        this.categoryRepo = typedi_1.Container.get(category_1.CategoryRepositoryImpl);
        this.cloudinary = typedi_1.Container.get(cloudinary_1.Cloudinary);
    }
    /** overiding execute method */
    async execute(entity) {
        /** check name in database */
        const resultGet = await this.handleGetCategoryByName(entity?.body?.name);
        if (resultGet.isFailure())
            return (0, either_1.failure)(resultGet.error);
        /** handle cloudinary iamge */
        let img = fs_1.default.readFileSync(entity?.file?.path);
        const params = {
            database64: 'data:image/png;base64,' + img.toString('base64'),
            package: 'CategoryImages',
            publicId: entity?.body?.name.toUpperCase()
        };
        const resImage = await this.handleGetLinkImage(params);
        if (resImage.isFailure())
            return (0, either_1.failure)(resImage.error);
        const _entity = { ...entity };
        /** create category */
        const resultCreate = await this.handleCreateCategory(_entity, resImage.data);
        if (resultCreate.isFailure())
            return (0, either_1.failure)(resultCreate.error);
        /** proccessing data */
        const init = new Category_1.CategoryModel();
        const result = init.fromCategoryModel(resultCreate.data);
        return (0, either_1.success)(result);
    }
    /** @todo: get category by name */
    handleGetCategoryByName = async (name) => {
        const res = await this.categoryRepo.getByName(name.toUpperCase());
        if (res)
            return (0, either_1.failure)(new appError_1.default('Category is exists in database!', 400));
        return (0, either_1.success)(false);
    };
    //* handle cloudinary iamge
    handleGetLinkImage = async (params) => {
        const response = await this.cloudinary.uploadImage(params);
        return (0, either_1.success)(response?.url);
    };
    // * handle create category
    handleCreateCategory = async (data, image) => {
        const dataCreate = {
            accountId: data?.account?.id,
            image: image,
            name: data?.body?.name.toUpperCase()
        };
        const res = await this.categoryRepo.create(dataCreate);
        return (0, either_1.success)(res);
    };
};
exports.CreateCategoryServiceImpl = CreateCategoryServiceImpl;
exports.CreateCategoryServiceImpl = CreateCategoryServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], CreateCategoryServiceImpl);
