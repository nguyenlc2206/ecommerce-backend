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
    /** create method */
    router.post('/product', instanceAuth.protect, middlewareRoleRestrictTo(['admin']), instanceProduct.create);
    /** create size method */
    router.post('/product/size', instanceAuth.protect, middlewareRoleRestrictTo(['admin']), instanceProduct.createSize);
    /** update method */
    router.patch('/product/:id', instanceAuth.protect, middlewareRoleRestrictTo(['admin']), instanceProduct.update);
    /** delete method */
    router.delete('/product/:id', instanceAuth.protect, middlewareRoleRestrictTo(['admin']), instanceProduct.delete);
    /** getAll method */
    router.get('/product/getAll', instanceAuth.protect, instanceProduct.getAll);
    /** get product by id */
    router.get('/product/:id', instanceAuth.protect, instanceProduct.getById);
    /** get product size by id */
    router.get(
        '/product/sizes/:id',
        instanceAuth.protect,
        middlewareRoleRestrictTo(['admin']),
        instanceProduct.getAllSize
    );
    /** get product by id and size*/
    router.get('/product?:id?:size', instanceAuth.protect, instanceProduct.getByIdAndSize);
};
