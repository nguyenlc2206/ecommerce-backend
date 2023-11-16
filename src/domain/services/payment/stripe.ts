// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';
import Stripe from 'stripe';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { Either, success } from '@ecommerce-backend/src/shared/common/either';
import { AccountRequest, KeyedObject } from '@ecommerce-backend/src/shared/types';
import { CouponModel } from '@ecommerce-backend/src/domain/models/Coupon';
import ENV from '@ecommerce-backend/src/main/config/env';

// ==============================||  STRIPE PAYMENT SERVICES IMPLEMENT ||============================== //

export interface PaymentStripeService<Entity> {
    execute(req: AccountRequest, orderId: string, coupon: CouponModel): Promise<Either<KeyedObject, AppError>>;
}

@Service()
export class PaymentStripeServiceImpl<Entity extends KeyedObject> implements PaymentStripeService<Entity> {
    /** init repo */
    //stripe instance
    protected stripe = new Stripe(ENV.stripeSecretKey);
    // * constructor
    constructor() {}

    /** overiding execute method */
    async execute(req: AccountRequest, orderId: string, coupon: CouponModel): Promise<Either<KeyedObject, AppError>> {
        const convertedOrders = req?.body?.orderItems.map((item: KeyedObject) => {
            const _discount = item?.discount ? item?.discount : 0;
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item?.name,
                        description: item?.description
                    },
                    unit_amount: Math.round(
                        (_discount + coupon?.discount
                            ? item?.price * (1 - (_discount + coupon?.discount) / 100)
                            : item?.price * (1 - _discount / 100)) * 100
                    )
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

        return success({ url: session.url });
    }
}
