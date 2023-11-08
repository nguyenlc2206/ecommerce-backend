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
exports.ProductSizeRepositoryImpl = void 0;
// * import lib
const typedi_1 = require("typedi");
const Size_1 = __importDefault(require("../../../infrastructure/schema/products/Size"));
// ==============================||  PRODUCT SIZE REPOSITORY IMPLEMENT ||============================== //
let ProductSizeRepositoryImpl = class ProductSizeRepositoryImpl {
    // * constructor
    constructor() { }
    /** overiding create method */
    async create(entity) {
        const result = await new Size_1.default(entity).save();
        return result;
    }
    /** overiding insertMany method */
    async insertMary(entity) {
        const result = await Size_1.default.insertMany(entity);
        return result;
    }
    /** overiding getByProductIdAndSize method */
    async getByProductIdAndSize(id, size, color) {
        const popObj = {
            path: 'productId',
            select: 'name id description images',
            populate: {
                path: 'categoryId',
                select: 'name id'
            }
        };
        const result = await Size_1.default.find({ productId: id, size: size, color: color }).populate(popObj);
        return result;
    }
    /** overiding update method */
    async update(id, entity) {
        let session = await Size_1.default.startSession();
        session.startTransaction();
        const result = await Size_1.default.findByIdAndUpdate(id, entity);
        session.commitTransaction();
        session.endSession();
        return result;
    }
    /** overiding getByProductId method */
    async getByProductId(id) {
        const popObj = {
            path: 'productId',
            select: 'name id description images',
            populate: {
                path: 'categoryId',
                select: 'name id'
            }
        };
        const result = await Size_1.default.find({ productId: id }).populate(popObj);
        return result;
    }
    /** overiding find method */
    async find(entity) {
        const popObj = {
            path: 'productId',
            select: 'name id description images',
            populate: {
                path: 'categoryId',
                select: 'name id',
                match: entity?.populate
            }
        };
        const result = await Size_1.default.find(entity?.filter).populate(popObj);
        return result;
    }
};
exports.ProductSizeRepositoryImpl = ProductSizeRepositoryImpl;
exports.ProductSizeRepositoryImpl = ProductSizeRepositoryImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], ProductSizeRepositoryImpl);
