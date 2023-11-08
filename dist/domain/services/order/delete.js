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
exports.DeleteOrderServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import projects
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const either_1 = require("../../../shared/common/either");
const order_1 = require("../../../infrastructure/repositories/order");
const size_impl_1 = require("../../../infrastructure/repositories/products/size.impl");
let DeleteOrderServiceImpl = class DeleteOrderServiceImpl {
    /** init repo */
    orderRepo;
    productSizeRepo;
    // * constructor
    constructor() {
        this.orderRepo = typedi_1.Container.get(order_1.OrderRepositoryImpl);
        this.productSizeRepo = typedi_1.Container.get(size_impl_1.ProductSizeRepositoryImpl);
    }
    /** overiding execute method */
    async execute(entity) {
        /** handle get order by id */
        const resultGet = await this.hanleGetOrder(entity?.params?.id);
        if (resultGet.isFailure())
            return (0, either_1.failure)(resultGet.error);
        // * handle update product size
        const resultUpdate = this.handleUpdateProductSize(resultGet.data);
        /** get all account by id */
        const response = await this.orderRepo.delete(entity?.params?.id);
        return (0, either_1.success)('okie');
    }
    /** handle get order by id */
    hanleGetOrder = async (id) => {
        const response = await this.orderRepo.getById(id);
        if (!response)
            return (0, either_1.failure)(new appError_1.default('Not have order!', 400));
        return (0, either_1.success)(response);
    };
    /** @todo: handle update product size */
    handleUpdateProductSize = async (data) => {
        data?.orderItems?.map(async (item) => {
            const product = await this.productSizeRepo.getByProductIdAndSize(item?.id, item?.size);
            const dataUpdate = {
                totalQty: Number(product[0]?.totalQty) + Number(item?.qty),
                totalSold: Number(product[0]?.totalSold) - Number(item?.qty)
            };
            await this.productSizeRepo.update(product[0]?.id, dataUpdate);
        });
        return (0, either_1.success)('okie');
    };
};
exports.DeleteOrderServiceImpl = DeleteOrderServiceImpl;
exports.DeleteOrderServiceImpl = DeleteOrderServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], DeleteOrderServiceImpl);
