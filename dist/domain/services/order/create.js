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
exports.CreateOrderServiceImpl = void 0;
// * import lib
const typedi_1 = require("typedi");
const _ = __importStar(require("lodash"));
const stripe_1 = __importDefault(require("stripe"));
// * import projects
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const either_1 = require("../../../shared/common/either");
const account_impl_1 = require("../../../infrastructure/repositories/account.impl");
const order_1 = require("../../../infrastructure/repositories/order");
const size_impl_1 = require("../../../infrastructure/repositories/products/size.impl");
const env_1 = __importDefault(require("../../../main/config/env"));
const discount_1 = require("../../../domain/services/coupon/discount");
let CreateOrderServiceImpl = class CreateOrderServiceImpl {
    /** init repo */
    accountRepo;
    orderRepo;
    productSizeRepo;
    discountService;
    //stripe instance
    stripe = new stripe_1.default(env_1.default.stripeSecretKey);
    /** constructor */
    constructor() {
        this.accountRepo = typedi_1.Container.get(account_impl_1.AccountRepositoryImpl);
        this.orderRepo = typedi_1.Container.get(order_1.OrderRepositoryImpl);
        this.productSizeRepo = typedi_1.Container.get(size_impl_1.ProductSizeRepositoryImpl);
        this.discountService = typedi_1.Container.get(discount_1.DiscountServiceImpl);
    }
    /** overiding execute */
    async execute(entity) {
        // * handle get discount if have
        let coupon = {};
        if (entity?.body?.codes) {
            const resultDiscount = await this.handleGetDiscount(entity);
            if (resultDiscount.isFailure())
                return (0, either_1.failure)(resultDiscount.error);
            coupon = resultDiscount.data;
        }
        // * check has address
        const resultCheck = await this.handleCheckAddress(entity);
        if (resultCheck.isFailure())
            return (0, either_1.failure)(resultCheck.error);
        // * handle get product
        const resultGet = await this.handleGetProduct(entity);
        if (resultGet.isFailure())
            return (0, either_1.failure)(resultGet.error);
        // * handle save order
        const resultSave = await this.handleSaveOrder(entity?.accountId, entity?.body);
        if (resultSave.isFailure())
            return (0, either_1.failure)(resultSave.error);
        // * handle update product size
        const resultUpdate = this.handleUpdateProductSize(entity);
        // * handle create session stripe
        const resultStripe = await this.handleCreateStripeSession(entity, resultSave.data?.id, coupon);
        if (resultStripe.isFailure())
            return (0, either_1.failure)(resultStripe.error);
        return (0, either_1.success)(resultStripe.data);
    }
    /** @todo: check has address */
    handleCheckAddress = async (req) => {
        const account = await this.accountRepo.getById(req?.accountId);
        if (!_.isEmpty(account?.shippingAddress)) {
            const dataAddress = { shippingAddress: req?.body?.shippingAddress };
            await this.accountRepo.update(req?.accountId, dataAddress);
            return (0, either_1.success)(true);
        }
        return (0, either_1.success)(true);
    };
    /** @todo: get product with id and size */
    handleGetProduct = async (req) => {
        let error = null;
        await Promise.all(req?.body?.orderItems.map(async (data) => {
            const product = await this.productSizeRepo.getByProductIdAndSize(data?.id, data?.size, data?.color);
            if (product.length === 0) {
                error = (0, either_1.failure)(new appError_1.default(`Product ${data?.name} is not exists!`, 400));
                return;
            }
            if (Number(product[0].totalQty) < Number(data?.qty)) {
                error = (0, either_1.failure)(new appError_1.default(`Something wrong from qty with product name ${data?.name}!`, 400));
                return;
            }
        }));
        if (error)
            return error;
        return (0, either_1.success)('okie');
    };
    /** @todo: save order to database */
    handleSaveOrder = async (accountId, entity) => {
        const dataCreate = {
            accountId: accountId,
            ...entity
        };
        const response = await this.orderRepo.create(dataCreate);
        return (0, either_1.success)(response);
    };
    /** @todo: handle update product size */
    handleUpdateProductSize = async (req) => {
        let error = null;
        req?.body?.orderItems.map(async (data) => {
            const product = await this.productSizeRepo.getByProductIdAndSize(data?.id, data?.size, data?.color);
            const dataUpdate = {
                totalQty: Number(product[0]?.totalQty) - Number(data?.qty),
                totalSold: Number(product[0]?.totalSold) + Number(data?.qty)
            };
            await this.productSizeRepo.update(product[0]?.id, dataUpdate);
        });
        if (error)
            return error;
        return (0, either_1.success)('okie');
    };
    /** @todo: handle get discount if have */
    handleGetDiscount = async (req) => {
        const discount = await this.discountService.execute(req);
        if (discount.isFailure())
            return (0, either_1.failure)(discount.error);
        return (0, either_1.success)(discount.data);
    };
    /** @todo: handle convert orderItems to stripe need */
    handleCreateStripeSession = async (req, orderId, coupon) => {
        const convertedOrders = req?.body?.orderItems.map((item) => {
            const _discount = item?.discount ? item?.discount : 0;
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item?.name,
                        description: item?.description
                    },
                    unit_amount: _discount + coupon?.discount
                        ? item?.price * (1 - (_discount + coupon?.discount) / 100)
                        : item?.price
                },
                quantity: item?.qty
            };
        });
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: req?.email,
            line_items: convertedOrders,
            metadata: {
                orderId: JSON.stringify(orderId),
                accountId: JSON.stringify(req?.accountId),
                couponId: JSON.stringify(coupon?.id)
            },
            mode: 'payment',
            client_reference_id: orderId,
            success_url: 'http://localhost:8000/success',
            cancel_url: 'http://localhost:8000/cancel'
            // success_url: `${req.protocol}://${req.get('host')}/my-orders`,
            // cancel_url: 'http://localhost:3000/cancel'
        });
        return (0, either_1.success)({ url: session.url });
    };
};
exports.CreateOrderServiceImpl = CreateOrderServiceImpl;
exports.CreateOrderServiceImpl = CreateOrderServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], CreateOrderServiceImpl);
