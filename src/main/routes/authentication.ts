// * import lib
import { Router } from 'express';
import { Container } from 'typedi';

// * import projects
import { AccountController } from '@ecommerce-backend/src/main/controllers/account';
import { AuthenticationController } from '@ecommerce-backend/src/main/controllers/authentication';
import uploadFile from '@ecommerce-backend/src/shared/common/uploadFile';
import middlewareRoleRestrictTo from '@ecommerce-backend/src/shared/common/middleware';

/** init instance controller */
const instanceAuth = Container.get(AuthenticationController);
const instanceAccount = Container.get(AccountController);

/** @todo: init routes */
export const AuthenticationRoutes = (router: Router) => {
    // * create account
    router.post('/register', uploadFile.single('image'), instanceAccount.create);
    // * login router
    router.post('/login', instanceAuth.login);
    // * change password account
    router.patch('/change-password', instanceAuth.protect, instanceAuth.changePassword);
    // * change password by admin
    router.patch(
        '/change-password/admin/:id',
        instanceAuth.protect,
        middlewareRoleRestrictTo(['admin']),
        instanceAuth.changePasswordAdmin
    );
    // * forgot password
    router.patch('/forgot-password', instanceAuth.forgotPassword);
    // * logout router
    router.get('/logout', instanceAuth.protect, instanceAuth.logout);
};
