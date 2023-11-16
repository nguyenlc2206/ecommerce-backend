// * import lib
import { Router } from 'express';
import { Container } from 'typedi';

// * import projects
import { OrderController } from '@ecommerce-backend/src/main/controllers/order';
import { AuthenticationController } from '@ecommerce-backend/src/main/controllers/authentication';
import middlewareRoleRestrictTo from '@ecommerce-backend/src/shared/common/middleware';

/** init controller */
const instanceOrder = Container.get(OrderController);
const instanceAuth = Container.get(AuthenticationController);

/** @todo: init routes */
export const OrderRoutes = (router: Router) => {
    // * ceate order
    router.post('/order', instanceAuth.protect, instanceOrder.create);
    /** delete method */
    router.delete('/order/:id', instanceAuth.protect, middlewareRoleRestrictTo(['admin']), instanceOrder.delete);
    /** getAll method */
    router.get('/order/getAll', instanceAuth.protect, middlewareRoleRestrictTo(['admin']), instanceOrder.getAll);
    /** get account by id */
    router.get('/order/:id', instanceAuth.protect, instanceOrder.getById);
    /** get account by id */
    router.get('/order-me', instanceAuth.protect, instanceOrder.getOrderMe);
    /** get paginate method*/
    router.get('/order?:page?:limit', instanceAuth.protect, instanceOrder.getPaginate);
};
