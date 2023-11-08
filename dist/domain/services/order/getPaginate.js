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
exports.GetPaginateOrderServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
const either_1 = require("../../../shared/common/either");
const Order_1 = require("../../../domain/models/Order");
const order_1 = require("../../../infrastructure/repositories/order");
let GetPaginateOrderServiceImpl = class GetPaginateOrderServiceImpl {
    /** init services */
    orderRepo;
    // * constructor
    constructor() {
        this.orderRepo = typedi_1.Container.get(order_1.OrderRepositoryImpl);
    }
    /** overiding execute method */
    async execute(entity) {
        // * page
        const page = Number(entity?.query?.page) ? Number(entity?.query?.page) : 1;
        // * limit
        const limit = Number(entity?.query?.limit) ? Number(entity?.query?.limit) : 10;
        //startIdx
        const startIndex = (page - 1) * limit;
        // * endIdx
        const endIndex = page * limit;
        // * total
        const total = await this.orderRepo.getTotal();
        // * processing data
        const orderQuery = await this.orderRepo.getPaginate(startIndex, limit);
        const _init = new Order_1.OrderModel();
        const result = _init.fromOrderModelGetAll(orderQuery);
        return (0, either_1.success)(result);
    }
};
exports.GetPaginateOrderServiceImpl = GetPaginateOrderServiceImpl;
exports.GetPaginateOrderServiceImpl = GetPaginateOrderServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], GetPaginateOrderServiceImpl);
