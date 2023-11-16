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
// * import projects
const appError_1 = __importDefault(require("../../../shared/common/appError"));
const either_1 = require("../../../shared/common/either");
const account_impl_1 = require("../../../infrastructure/repositories/account.impl");
const Order_1 = require("../../../domain/models/Order");
const order_impl_1 = require("../../../infrastructure/repositories/order.impl");
const size_impl_1 = require("../../../infrastructure/repositories/products/size.impl");
const discount_1 = require("../../../domain/services/coupon/discount");
// import payment
const stripe_1 = require("../../../domain/services/payment/stripe");
const coupon_impl_1 = require("../../../infrastructure/repositories/coupon.impl");
const email_1 = require("../../../shared/common/email");
let CreateOrderServiceImpl = class CreateOrderServiceImpl {
    /** init repo */
    accountRepo;
    orderRepo;
    productSizeRepo;
    discountService;
    couponRepo;
    /** init stripe payment */
    paymentStripe;
    emailService;
    /** constructor */
    constructor() {
        this.accountRepo = typedi_1.Container.get(account_impl_1.AccountRepositoryImpl);
        this.orderRepo = typedi_1.Container.get(order_impl_1.OrderRepositoryImpl);
        this.productSizeRepo = typedi_1.Container.get(size_impl_1.ProductSizeRepositoryImpl);
        this.discountService = typedi_1.Container.get(discount_1.DiscountServiceImpl);
        this.paymentStripe = typedi_1.Container.get(stripe_1.PaymentStripeServiceImpl);
        this.couponRepo = typedi_1.Container.get(coupon_impl_1.CouponRepositoryImpl);
        this.emailService = typedi_1.Container.get(email_1.Email);
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
        const _init = new Order_1.OrderModel();
        const result = _init.fromOrderModel(resultSave.data);
        // * handle send email confirm order
        const resultSendEmail = this.handleSendEmailConfirmOrder(entity, result);
        // * handle update product size
        const resultUpdate = this.handleUpdateProductSize(entity);
        // handle update coupon
        const resultCoupon = this.handleUpdateCodeCoupon(entity?.accountId, coupon);
        // switch case processing payment
        switch (entity?.body?.paymentCharged?.method) {
            case 'card': {
                const resultStripe = await this.paymentStripe.execute(entity, resultSave.data?.id, coupon);
                if (resultStripe.isFailure())
                    return (0, either_1.failure)(resultStripe.error);
                return (0, either_1.success)({ ...resultStripe.data, ...result });
            }
            default: {
                return (0, either_1.success)(result);
            }
        }
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
    /** @todo: processing code is use */
    handleUpdateCodeCoupon = async (accountId, coupon) => {
        const couponFinded = await this.couponRepo.getById(coupon?.id);
        if (couponFinded?.type === 'personal') {
            const res = await this.couponRepo.delete(coupon?.id);
            return (0, either_1.success)(res);
        }
        const _arrayAccounts = couponFinded?.accountIdExpires;
        if (!_arrayAccounts?.includes(accountId))
            _arrayAccounts?.push(accountId);
        const res = await this.couponRepo.update(coupon?.id, { accountIdExpires: _arrayAccounts });
        return (0, either_1.success)(res);
    };
    /** hadnle send email confirm order */
    handleSendEmailConfirmOrder = async (entity, data) => {
        const dataConfirm = {
            fullName: entity?.account?.fullName,
            email: entity?.account?.email,
            phoneNumber: entity?.account?.phoneNo,
            paymentType: data?.paymentCharged?.method,
            orderId: data?.orderNumber,
            orderDate: data?.createdAt,
            productItems: data?.orderItems,
            dicount: entity?.body?.discounts[0]?.value,
            note: 'Somthing from customer!'
        };
        const res = await this.emailService.sendEmailConfirmOrder(dataConfirm);
        return (0, either_1.success)(true);
    };
};
exports.CreateOrderServiceImpl = CreateOrderServiceImpl;
exports.CreateOrderServiceImpl = CreateOrderServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], CreateOrderServiceImpl);
