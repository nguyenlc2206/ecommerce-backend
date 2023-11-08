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
exports.ProductCartRepositoryImpl = void 0;
// * import lib
const typedi_1 = require("typedi");
const Cart_1 = __importDefault(require("../../../infrastructure/schema/products/Cart"));
// ==============================||  PRODUCT CART REPOSITORY IMPLEMENT ||============================== //
let ProductCartRepositoryImpl = class ProductCartRepositoryImpl {
    // * constructor
    constructor() { }
    /** overiding create method */
    async create(entity) {
        const result = await new Cart_1.default(entity).save();
        return result;
    }
    /** overiding update method */
    async update(id, entity) {
        let session = await Cart_1.default.startSession();
        session.startTransaction();
        const result = await Cart_1.default.findByIdAndUpdate(id, entity);
        session.commitTransaction();
        session.endSession();
        return result;
    }
    /** overiding find method */
    async find(entity) {
        const result = await Cart_1.default.find();
        return result;
    }
    /** overring get cart by account id */
    async getCartByAccountId(id) {
        const result = await Cart_1.default.findOne({ accountId: id });
        return result;
    }
};
exports.ProductCartRepositoryImpl = ProductCartRepositoryImpl;
exports.ProductCartRepositoryImpl = ProductCartRepositoryImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], ProductCartRepositoryImpl);
