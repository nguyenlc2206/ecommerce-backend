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
exports.GetAllOrderServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import projects
const either_1 = require("../../../shared/common/either");
const Order_1 = require("../../../domain/models/Order");
const order_1 = require("../../../infrastructure/repositories/order");
let GetAllOrderServiceImpl = class GetAllOrderServiceImpl {
    orderRepo;
    // * constructor
    constructor() {
        this.orderRepo = typedi_1.Container.get(order_1.OrderRepositoryImpl);
    }
    /** overiding execute method */
    async execute() {
        /** get all order */
        const response = await this.orderRepo.getAll();
        const _init = new Order_1.OrderModel();
        const result = _init.fromOrderModelGetAll(response);
        return (0, either_1.success)(result);
    }
};
exports.GetAllOrderServiceImpl = GetAllOrderServiceImpl;
exports.GetAllOrderServiceImpl = GetAllOrderServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], GetAllOrderServiceImpl);
