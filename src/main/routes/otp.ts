// * import lib
import { Router } from 'express';
import { Container } from 'typedi';

// * import projects
import { OTPController } from '@ecommerce-backend/src/main/controllers/otp/index';

/** init controller */
const instance = Container.get(OTPController);
// console.log('>>>Check instance:', instance);

/** @todo: init routes */
export const OTPRoutes = (router: Router) => {
    // * verify otp
    router.post('/verify-otp', instance.verifyOTP);
};
