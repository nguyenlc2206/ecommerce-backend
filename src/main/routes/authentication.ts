// * import lib
import { Router } from 'express';
import { Container } from 'typedi';

// * import projects
import { AccountController } from '@ecommerce-backend/src/main/controllers/account';
import { AuthenticationController } from '@ecommerce-backend/src/main/controllers/authentication';

/** init instance controller */
const instanceAuth = Container.get(AuthenticationController);
const instanceAccount = Container.get(AccountController);

/** @todo: init routes */
export const AuthenticationRoutes = (router: Router) => {
    // * create account
    router.post('/register', instanceAccount.create);
    // * login router
    router.post('/login', instanceAuth.login);
    // * change password account
    router.patch('/change-password', instanceAuth.protect, instanceAuth.changePassword);
    // * forgot password
    router.patch('/forgot-password', instanceAuth.forgotPassword);
};
