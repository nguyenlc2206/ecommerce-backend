// * import lib
import { Express, NextFunction, Request, Response, Router } from 'express';
import express from 'express';
import Stripe from 'stripe';
import ENV from '@ecommerce-backend/src/main/config/env';
import Container from 'typedi';
import { UpdateOrderServiceImpl } from '@ecommerce-backend/src/domain/services/order/update';
import { OrderModel } from '@ecommerce-backend/src/domain/models/Order';
import { UpdateCouponServiceImpl } from '@ecommerce-backend/src/domain/services/coupon/update';
import { CouponModel } from '@ecommerce-backend/src/domain/models/Coupon';

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpoint_secret = 'whsec_e72203a1ae04642e4cf4c6d63e86fd4826ea05042413774baa4f08764dc3c72d';
const stripe = new Stripe(ENV.stripeSecretKey);

const updateOrderService = Container.get(UpdateOrderServiceImpl);
const updateCouponService = Container.get(UpdateCouponServiceImpl);

const StripeWebhook = (app: Express): void => {
    /** init router */
    const router = Router();
    router.post(
        '/webhook',
        express.raw({ type: 'application/json' }),
        async (req: Request, res: Response, next: NextFunction) => {
            let event;
            const sig: any = req.headers['stripe-signature'];
            try {
                event = stripe.webhooks.constructEvent(req.body, sig, endpoint_secret);
            } catch (err: any) {
                console.log('err', err.message);
                res.status(400).send(`Webhook Error: ${err.message}`);
                return;
            }
            // Handle the event
            switch (event.type) {
                case 'checkout.session.completed':
                    //update the order
                    const session = event.data.object;
                    const { orderId, accountId, couponId } = session.metadata!;

                    /** @todo: update order */
                    const dataUpdateOrder = {
                        id: JSON.parse(orderId),
                        paymentStatus: session.payment_status,
                        paymentMethod: session.payment_method_types[0],
                        totalPrice: session.amount_total,
                        currency: session.currency
                    } as OrderModel;
                    const responseUpdateOrder = updateOrderService.execute(dataUpdateOrder);

                    /** @todo: update coupon */
                    const dataUpdateCoupon = {
                        id: JSON.parse(couponId),
                        accountId: JSON.parse(accountId)
                    } as CouponModel;
                    const responseUpdateCoupon = updateCouponService.execute(dataUpdateCoupon);
                    // Then define and call a function to handle the event payment_intent.succeeded
                    break;
                // ... handle other event types
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }
            // Return a 200 response to acknowledge receipt of the event
            res.send();
        }
    );

    app.use('/', router);
};

export default StripeWebhook;
