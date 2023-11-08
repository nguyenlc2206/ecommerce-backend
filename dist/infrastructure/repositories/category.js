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
exports.CategoryRepositoryImpl = void 0;
// * import lib
const typedi_1 = require("typedi");
const Category_1 = __importDefault(require("../../infrastructure/schema/Category"));
// ==============================||  CATEGORY REPOSITORY IMPLEMENT ||============================== //
let CategoryRepositoryImpl = class CategoryRepositoryImpl {
    /** constructor */
    constructor() { }
    /** overiding create method */
    async create(entity) {
        const result = await new Category_1.default(entity).save();
        return result;
    }
    /** overiding getByName method */
    async getByName(name) {
        const result = await Category_1.default.findOne({ name });
        return result;
    }
    /** overiding getById method */
    async getById(id) {
        const result = await Category_1.default.findById(id);
        return result;
    }
    /** overiding update method */
    async update(id, entity) {
        const result = await Category_1.default.findByIdAndUpdate(id, entity);
        return result;
    }
    /** overiding delete method */
    async delete(id) {
        const result = await Category_1.default.findById(id);
        if (result) {
            result.isDeleted = true;
            result.deletedAt = new Date(Date.now());
            await result.save();
        }
    }
    /** overiding getAll method */
    async getAll() {
        // const popObj = {
        //     path: 'categories',
        //     select: 'name'
        // };
        // const result = await AccountEntity.find().populate(popObj);
        const result = await Category_1.default.find();
        return result;
    }
};
exports.CategoryRepositoryImpl = CategoryRepositoryImpl;
exports.CategoryRepositoryImpl = CategoryRepositoryImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], CategoryRepositoryImpl);
