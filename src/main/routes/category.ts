// * import lib
import { Router } from 'express';
import { Container } from 'typedi';

// * import projects
import { CategoryController } from '@ecommerce-backend/src/main/controllers/category';
import { AuthenticationController } from '@ecommerce-backend/src/main/controllers/authentication';
import middlewareRoleRestrictTo from '@ecommerce-backend/src/shared/common/middleware';

/** init controller */
const instanceCategory = Container.get(CategoryController);
const instanceAuth = Container.get(AuthenticationController);

/** @todo: init routes */
export const CategoryRoutes = (router: Router) => {
    // protect routes
    router.use(instanceAuth.protect);
    /** create method */
    router.post('/category', middlewareRoleRestrictTo(['admin']), instanceCategory.create);
    /** update method */
    router.patch('/category/:id', middlewareRoleRestrictTo(['admin']), instanceCategory.update);
    /** delete method */
    router.delete('/category/:id', middlewareRoleRestrictTo(['admin']), instanceCategory.delete);
    /** getAll mwthod */
    router.get('/category/getAll', instanceCategory.getAll);
    /** get account by id */
    router.get('/category/:id', instanceCategory.getById);
};
