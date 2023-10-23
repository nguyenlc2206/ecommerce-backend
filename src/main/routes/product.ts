// * import lib
import { Router } from 'express';
import { Container } from 'typedi';

// * import projects
import { ProductController } from '@ecommerce-backend/src/main/controllers/product';
import { AuthenticationController } from '@ecommerce-backend/src/main/controllers/authentication';
import middlewareRoleRestrictTo from '@ecommerce-backend/src/shared/common/middleware';

/** init controller */
const instanceProduct = Container.get(ProductController);
const instanceAuth = Container.get(AuthenticationController);

/** @todo: init routes */
export const ProductRoutes = (router: Router) => {
    // protect routes
    router.use(instanceAuth.protect);
    /** create method */
    router.post('/product', middlewareRoleRestrictTo(['admin']), instanceProduct.create);
};
