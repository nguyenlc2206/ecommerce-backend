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
exports.PaymentStripeServiceImpl = void 0;
// * import libs
require("reflect-metadata");
const typedi_1 = require("typedi");
const stripe_1 = __importDefault(require("stripe"));
const either_1 = require("../../../shared/common/either");
const env_1 = __importDefault(require("../../../main/config/env"));
let PaymentStripeServiceImpl = class PaymentStripeServiceImpl {
    /** init repo */
    //stripe instance
    stripe = new stripe_1.default(env_1.default.stripeSecretKey);
    // * constructor
    constructor() { }
    /** overiding execute method */
    async execute(req, orderId, coupon) {
        const convertedOrders = req?.body?.orderItems.map((item) => {
            const _discount = item?.discount ? item?.discount : 0;
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item?.name,
                        description: item?.description
                    },
                    unit_amount: Math.round((_discount + coupon?.discount
                        ? item?.price * (1 - (_discount + coupon?.discount) / 100)
                        : item?.price * (1 - _discount / 100)) * 100)
                },
                quantity: item?.qty
            };
        });
        console.log('>>>Check convertedOrders:', convertedOrders);
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
            success_url: 'http://127.0.0.1:5173/checkout/success',
            cancel_url: 'http://localhost:8000/checkout/fail'
            // success_url: `${req.protocol}://${req.get('host')}/my-orders`,
            // cancel_url: 'http://localhost:3000/cancel'
        });
        return (0, either_1.success)({ url: session.url });
    }
};
exports.PaymentStripeServiceImpl = PaymentStripeServiceImpl;
exports.PaymentStripeServiceImpl = PaymentStripeServiceImpl = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], PaymentStripeServiceImpl);
