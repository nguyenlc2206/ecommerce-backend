// * import lib
import { Express, Router } from 'express';

// * import projects
import { OTPRoutes } from '@ecommerce-backend/src/main/routes/otp';
import { AccountRoutes } from '@ecommerce-backend/src/main/routes/account';
import { AuthenticationRoutes } from '@ecommerce-backend/src/main/routes/authentication';
import { CategoryRoutes } from '@ecommerce-backend/src/main/routes/category';
import { ProductRoutes } from '@ecommerce-backend/src/main/routes/product';
import { OrderRoutes } from '@ecommerce-backend/src/main/routes/order';
import { CouponRoutes } from '@ecommerce-backend/src/main/routes/coupon';

/** @todo: setup configs routes express */

const ExpressRoutes = (app: Express): void => {
    const routes: Array<any> = [
        AuthenticationRoutes,
        AccountRoutes,
        OTPRoutes,
        CategoryRoutes,
        ProductRoutes,
        OrderRoutes,
        CouponRoutes
    ];
    /** init router */
    const router = Router();
    app.use('/api/v1', router);

    routes.forEach((route) => route(router));
};

export default ExpressRoutes;
