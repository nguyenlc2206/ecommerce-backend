// * import lib
import { Router } from 'express';
import { Container } from 'typedi';

// * import projects
import { AccountController } from '@ecommerce-backend/src/main/controllers/account/index';
import { AuthenticationController } from '@ecommerce-backend/src/main/controllers/authentication';
import middlewareRoleRestrictTo from '@ecommerce-backend/src/shared/common/middleware';
import uploadFile from '@ecommerce-backend/src/shared/common/uploadFile';

/** init instance */
const instanceAccount = Container.get(AccountController);
const instanceAuth = Container.get(AuthenticationController);

// console.log('>>>Check instance:', instance);

/** @todo: init routes */
export const AccountRoutes = (router: Router) => {
    /** get account me */
    router.get('/account-me', instanceAuth.protect, instanceAccount.getMe);
    /** update account me */
    router.post('/account/update-me', uploadFile.single('avatar'), instanceAuth.protect, instanceAccount.updateMe);
    /** get all account */
    router.get('/account/getAll', instanceAuth.protect, middlewareRoleRestrictTo(['admin']), instanceAccount.getAll);
    /** delete account */
    router.delete('/account/:id', instanceAuth.protect, middlewareRoleRestrictTo(['admin']), instanceAccount.delete);
    /** update account */
    router.post(
        '/account/update/:id',
        uploadFile.single('avatar'),
        instanceAuth.protect,
        middlewareRoleRestrictTo(['admin']),
        instanceAccount.update
    );
    /** get account by id */
    router.get('/account/:id', instanceAuth.protect, middlewareRoleRestrictTo(['admin']), instanceAccount.getById);
};
