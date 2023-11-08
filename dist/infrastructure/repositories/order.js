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
exports.OrderRepositoryImpl = void 0;
// * import lib
const typedi_1 = require("typedi");
const Order_1 = __importDefault(require("../../infrastructure/schema/Order"));
// ==============================||  ORDER REPOSITORY IMPLEMENT ||============================== //
let OrderRepositoryImpl = class OrderRepositoryImpl {
    /** constructor */
    constructor() { }
    /** overiding create method */
    async create(entity) {
        const result = await new Order_1.default(entity).save();
        return result;
    }
    /** overiding getById method */
    async getById(id) {
        const result = await Order_1.default.findById(id);
        return result;
    }
    /** overiding delete method */
    async delete(id) {
        const result = await Order_1.default.findById(id);
        if (result) {
            result.isDeleted = true;
            result.deletedAt = new Date(Date.now());
            await result.save();
        }
    }
    /** overiding getAll method */
    async getAll() {
        const result = await Order_1.default.find();
        return result;
    }
    /** overiding update method */
    async update(id, entity) {
        const result = await Order_1.default.findByIdAndUpdate(id, entity);
        return result;
    }
    /** overiding getTotal method */
    async getTotal() {
        const total = await Order_1.default.countDocuments();
        return total;
    }
    /** overiding getPaginate method */
    async getPaginate(startIdx, limit) {
        const result = await Order_1.default.find().skip(startIdx).limit(limit);
        return result;
    }
};
exports.OrderRepositoryImpl = OrderRepositoryImpl;
exports.OrderRepositoryImpl = OrderRepositoryImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], OrderRepositoryImpl);
