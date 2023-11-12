// * import lib
import { Router } from 'express';
import { Container } from 'typedi';

// * import projects
import { ProductController } from '@ecommerce-backend/src/main/controllers/product';
import { AuthenticationController } from '@ecommerce-backend/src/main/controllers/authentication';
import middlewareRoleRestrictTo from '@ecommerce-backend/src/shared/common/middleware';
import uploadFile from '@ecommerce-backend/src/shared/common/uploadFile';
import { ProductCartController } from '@ecommerce-backend/src/main/controllers/cart';

/** init controller */
const instanceProduct = Container.get(ProductController);
const instanceAuth = Container.get(AuthenticationController);
const instanceProductCart = Container.get(ProductCartController);

/** @todo: init routes */
export const ProductRoutes = (router: Router) => {
    /** create method */
    router.post(
        '/product',
        uploadFile.array('images'),
        instanceAuth.protect,
        middlewareRoleRestrictTo(['admin']),
        instanceProduct.create
    );
    /** get product search*/
    router.get('/product/search', instanceAuth.protect, instanceProduct.query);
    /** add product cart */
    router.post('/product/cart', instanceAuth.protect, instanceProductCart.create);
    /** update product cart */
    router.patch('/product/cart', instanceAuth.protect, instanceProductCart.update);
    /** delete product cart */
    router.delete('/product/cart/:id', instanceAuth.protect, instanceProductCart.delete);
    /** get product cart by account id*/
    router.get('/product/cart', instanceAuth.protect, instanceProductCart.getByAccountId);
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
    /** filter product */
    router.post('/product/filter', instanceAuth.protect, instanceProduct.filter);
};
