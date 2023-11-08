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
exports.GetProductCartByAccountIdServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import projects
const either_1 = require("../../../shared/common/either");
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const Cart_1 = require("../../../domain/models/products/Cart");
const cart_impl_1 = require("../../../infrastructure/repositories/products/cart.impl");
let GetProductCartByAccountIdServiceImpl = class GetProductCartByAccountIdServiceImpl {
    // inii repo
    productCartRepo;
    // constructor
    constructor() {
        this.productCartRepo = typedi_1.Container.get(cart_impl_1.ProductCartRepositoryImpl);
    }
    // execute
    async execute(entity) {
        // check cart
        const resultCheck = await this.handleCheckCart(entity?.accountId);
        if (resultCheck.isFailure())
            return (0, either_1.failure)(resultCheck.error);
        const _init = new Cart_1.ProductCartModel();
        const result = _init.fromProductCartModel(resultCheck.data);
        return (0, either_1.success)(result);
    }
    /** @todo: check cart exists by acccountId */
    handleCheckCart = async (id) => {
        const response = await this.productCartRepo.getCartByAccountId(id);
        if (!response)
            return (0, either_1.failure)(new appError_1.default('Not have product in cart!', 400));
        return (0, either_1.success)(response);
    };
};
exports.GetProductCartByAccountIdServiceImpl = GetProductCartByAccountIdServiceImpl;
exports.GetProductCartByAccountIdServiceImpl = GetProductCartByAccountIdServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], GetProductCartByAccountIdServiceImpl);
