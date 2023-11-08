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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllProductSizeServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import projects
const either_1 = require("../../../shared/common/either");
const Size_1 = require("../../../domain/models/products/Size");
const size_impl_1 = require("../../../infrastructure/repositories/products/size.impl");
let GetAllProductSizeServiceImpl = class GetAllProductSizeServiceImpl {
    productSizeRepo;
    // * constructor
    constructor() {
        this.productSizeRepo = typedi_1.Container.get(size_impl_1.ProductSizeRepositoryImpl);
    }
    /** overiding execute method */
    async execute(entity) {
        /** get all category by id */
        const response = await this.productSizeRepo.getByProductId(entity?.params?.id);
        const _init = new Size_1.ProductSizeModel();
        const result = _init.fromProductModelGetAll(response);
        return (0, either_1.success)(result);
    }
};
exports.GetAllProductSizeServiceImpl = GetAllProductSizeServiceImpl;
exports.GetAllProductSizeServiceImpl = GetAllProductSizeServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], GetAllProductSizeServiceImpl);
