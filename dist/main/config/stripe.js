"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// * import lib
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const env_1 = __importDefault(require("../../main/config/env"));
const typedi_1 = __importDefault(require("typedi"));
const update_1 = require("../../domain/services/order/update");
const update_2 = require("../../domain/services/coupon/update");
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpoint_secret = 'whsec_e72203a1ae04642e4cf4c6d63e86fd4826ea05042413774baa4f08764dc3c72d';
const stripe = new stripe_1.default(env_1.default.stripeSecretKey);
const updateOrderService = typedi_1.default.get(update_1.UpdateOrderServiceImpl);
const updateCouponService = typedi_1.default.get(update_2.UpdateCouponServiceImpl);
const StripeWebhook = (app) => {
    /** init router */
    const router = (0, express_1.Router)();
    router.post('/webhook', express_2.default.raw({ type: 'application/json' }), async (req, res, next) => {
        let event;
        const sig = req.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpoint_secret);
        }
        catch (err) {
            console.log('err', err.message);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                //update the order
                const session = event.data.object;
                const { orderId, accountId, couponId } = session.metadata;
                /** @todo: update order */
                const dataUpdateOrder = {
                    id: JSON.parse(orderId),
                    paymentStatus: session.payment_status,
                    paymentMethod: session.payment_method_types[0],
                    totalPrice: session.amount_total,
                    currency: session.currency
                };
                const responseUpdateOrder = updateOrderService.execute(dataUpdateOrder);
                /** @todo: update coupon */
                const dataUpdateCoupon = {
                    id: JSON.parse(couponId),
                    accountId: JSON.parse(accountId)
                };
                const responseUpdateCoupon = updateCouponService.execute(dataUpdateCoupon);
                // Then define and call a function to handle the event payment_intent.succeeded
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        // Return a 200 response to acknowledge receipt of the event
        res.send();
    });
    app.use('/', router);
};
exports.default = StripeWebhook;
