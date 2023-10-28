// * import lib
import { Router } from 'express';
import { Container } from 'typedi';

// * import projects
import { AuthenticationController } from '@ecommerce-backend/src/main/controllers/authentication';
import middlewareRoleRestrictTo from '@ecommerce-backend/src/shared/common/middleware';
import { CouponController } from '@ecommerce-backend/src/main/controllers/coupon';

/** init controller */
const instanceCoupon = Container.get(CouponController);
const instanceAuth = Container.get(AuthenticationController);

/** @todo: init routes */
export const CouponRoutes = (router: Router) => {
    // * create coupon
    router.post('/coupon', instanceAuth.protect, middlewareRoleRestrictTo(['admin']), instanceCoupon.create);
    // * discount coupon
    router.post('/discount', instanceAuth.protect, instanceCoupon.discount);
    /** getAll method */
    router.get('/coupon/getAll', instanceAuth.protect, middlewareRoleRestrictTo(['admin']), instanceCoupon.getAll);
    /** delete method */
    router.delete('/coupon/:id', instanceAuth.protect, middlewareRoleRestrictTo(['admin']), instanceCoupon.delete);
};
