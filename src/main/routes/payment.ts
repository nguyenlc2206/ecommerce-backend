// * import lib
import { Router } from 'express';
import { Container } from 'typedi';

// * import projects
import { PaymentController } from '@ecommerce-backend/src/main/controllers/payment';

/** init controller */
const instance = Container.get(PaymentController);
// console.log('>>>Check instance:', instance);

/** @todo: init routes */
export const PaymentRoutes = (router: Router) => {
    // * payment-paypal
    router.get('/payment-paypal/success', instance.paypal);
};
