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
exports.UpdateProductCardServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
// * import projects
const either_1 = require("../../../shared/common/either");
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const Cart_1 = require("../../../domain/models/products/Cart");
const cart_impl_1 = require("../../../infrastructure/repositories/products/cart.impl");
const product_impl_1 = require("../../../infrastructure/repositories/products/product.impl");
const size_impl_1 = require("../../../infrastructure/repositories/products/size.impl");
let UpdateProductCardServiceImpl = class UpdateProductCardServiceImpl {
    // inii repo
    productCartRepo;
    productRepo;
    productSizeRepo;
    // constructor
    constructor() {
        this.productCartRepo = typedi_1.Container.get(cart_impl_1.ProductCartRepositoryImpl);
        this.productRepo = typedi_1.Container.get(product_impl_1.ProductRepositoryImpl);
        this.productSizeRepo = typedi_1.Container.get(size_impl_1.ProductSizeRepositoryImpl);
    }
    // execute
    async execute(entity) {
        // check cart
        const resultCheck = await this.handleCheckCart(entity?.accountId);
        if (resultCheck.isFailure())
            return (0, either_1.failure)(resultCheck.error);
        // check product item change
        if (entity?.body?.products) {
            const eleChanged = [
                ...this.handleGetEleChanged(entity?.body?.products, resultCheck?.data?.products),
                ...this.handleGetEleChanged(resultCheck?.data?.products, entity?.body?.products)
            ];
            const resultCheckProduct = await this.handleCheckProduct(eleChanged[0]?.productId);
            if (resultCheckProduct.isFailure())
                return (0, either_1.failure)(resultCheckProduct.error);
            // check product size
            const resultCheckSize = await this.handleCheckProductSize(eleChanged[0]?.id);
            if (resultCheckSize.isFailure())
                return (0, either_1.failure)(resultCheckSize.error);
        }
        // update cart
        let responseResult = {};
        // check order complete
        if (entity?.body?.status === 'complete') {
            // order from payment to complete
            const resultUpdate = await this.handleUpdateCart(resultCheck.data?.id, {
                ...entity?.body,
                products: [],
                discounts: [],
                status: 'initial'
            });
            if (resultUpdate.isFailure())
                return (0, either_1.failure)(resultUpdate.error);
            responseResult = resultUpdate.data;
            // send email confirm order
        }
        else {
            const resultUpdate = await this.handleUpdateCart(resultCheck.data?.id, entity?.body);
            if (resultUpdate.isFailure())
                return (0, either_1.failure)(resultUpdate.error);
            responseResult = resultUpdate.data;
        }
        // processing data
        const _init = new Cart_1.ProductCartModel();
        const result = _init.fromProductCartModel(responseResult);
        return (0, either_1.success)(result);
    }
    /** @todo: check cart exists by acccountId */
    handleCheckCart = async (id) => {
        const response = await this.productCartRepo.getCartByAccountId(id);
        if (!response)
            return (0, either_1.failure)(new appError_1.default('Not have product in cart!', 400));
        return (0, either_1.success)(response);
    };
    /** @todo: handle check product is active */
    handleCheckProduct = async (id) => {
        const response = await this.productRepo.getById(id);
        if (!response || response?.isDeleted)
            return (0, either_1.failure)(new appError_1.default('Product is out of stock!', 400));
        return (0, either_1.success)(true);
    };
    /** @todo: check product in size */
    handleCheckProductSize = async (id) => {
        const response = await this.productSizeRepo.getById(id);
        if (!response || response.isDeleted)
            return (0, either_1.failure)(new appError_1.default('Product is not active!', 400));
        return (0, either_1.success)(true);
    };
    /** @todo: update product cart */
    handleUpdateCart = async (id, entity) => {
        const response = await this.productCartRepo.update(id, entity);
        if (entity?.products) {
            // update products
            response.products = entity?.products;
        }
        else if (entity?.status && entity?.discounts) {
            // update discounts (update quantity)
            response.status = entity?.status;
            response.discounts = entity?.discounts;
        }
        else if (entity?.status && entity?.billingAddress) {
            // update billingAddress
            response.status = entity?.status;
            response.billingAddress = entity?.billingAddress;
        }
        else if (entity?.status && entity?.paymentMethod) {
            // update payment method
            response.status = entity?.status;
            response.paymentMethod = entity?.paymentMethod;
        }
        return (0, either_1.success)(response);
    };
    /** @todo: get ele change in array */
    handleGetEleChanged = (arr1, arr2) => {
        return arr1.filter((object1) => !arr2.some((object2) => object1.qty === object2.qty));
    };
};
exports.UpdateProductCardServiceImpl = UpdateProductCardServiceImpl;
exports.UpdateProductCardServiceImpl = UpdateProductCardServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], UpdateProductCardServiceImpl);
