"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProductCartServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const _ = __importStar(require("lodash"));
const typedi_1 = require("typedi");
// * import projects
const either_1 = require("../../../shared/common/either");
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const cart_impl_1 = require("../../../infrastructure/repositories/products/cart.impl");
let DeleteProductCartServiceImpl = class DeleteProductCartServiceImpl {
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
        // remove product cart
        const resultRemove = await this.handleRemoveProduct(entity.params?.id, resultCheck.data);
        if (resultRemove.isFailure())
            return (0, either_1.failure)(resultRemove.error);
        return (0, either_1.success)({});
    }
    /** @todo: check cart exists by acccountId */
    handleCheckCart = async (id) => {
        const response = await this.productCartRepo.getCartByAccountId(id);
        if (!response)
            return (0, either_1.failure)(new appError_1.default('Not have product in cart!', 400));
        return (0, either_1.success)(response);
    };
    /** @todo: delete product cart */
    handleRemoveProduct = async (id, cart) => {
        const products = _.cloneDeep(cart?.products);
        // check id product
        const itemFinded = _.find(products, { id: id });
        if (!itemFinded)
            return (0, either_1.failure)(new appError_1.default('Product is not exists!', 400));
        // check if product is empty
        _.remove(products, (product) => product.id === id);
        if (!products.length) {
            const res = await this.productCartRepo.delete(cart?.id);
        }
        const entity = { products: products };
        const res = await this.productCartRepo.update(cart?.id, entity);
        return (0, either_1.success)(res);
    };
};
exports.DeleteProductCartServiceImpl = DeleteProductCartServiceImpl;
exports.DeleteProductCartServiceImpl = DeleteProductCartServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], DeleteProductCartServiceImpl);
