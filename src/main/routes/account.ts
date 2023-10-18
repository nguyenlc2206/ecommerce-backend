// * import lib
import { Router } from 'express';
import { Container } from 'typedi';

// * import projects
import { AccountController } from '@ecommerce-backend/src/main/controllers/account/index';
import { AuthenticationController } from '@ecommerce-backend/src/main/controllers/authentication';
import middlewareRoleRestrictTo from '@ecommerce-backend/src/shared/common/middleware';

/** init instance */
const instanceAccount = Container.get(AccountController);
const instanceAuth = Container.get(AuthenticationController);

// console.log('>>>Check instance:', instance);

/** @todo: init routes */
export const AccountRoutes = (router: Router) => {
    // protect routes
    router.use(instanceAuth.protect);
    /** get account me */
    router.get('/account-me', instanceAccount.getMe);
    /** update account me */
    router.post('/account/update-me', instanceAccount.updateMe);
    /** get all account */
    router.get('/account/getAll', middlewareRoleRestrictTo(['admin']), instanceAccount.getAll);
    /** delete account */
    router.delete('/account/:id', middlewareRoleRestrictTo(['admin']), instanceAccount.delete);
    /** update account */
    router.post('/account/update/:id', middlewareRoleRestrictTo(['admin']), instanceAccount.update);
    /** get account by id */
    router.get('/account/:id', middlewareRoleRestrictTo(['admin']), instanceAccount.getById);
};
