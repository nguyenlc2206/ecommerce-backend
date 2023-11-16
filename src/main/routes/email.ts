// * import lib
import { Router } from 'express';
import { Container } from 'typedi';

// * import projects
import { EmailController } from '@ecommerce-backend/src/main/controllers/email';

/** init controller */
const instance = Container.get(EmailController);
// console.log('>>>Check instance:', instance);

/** @todo: init routes */
export const EmailRoutes = (router: Router) => {
    // * verify otp
    router.post('/email-support', instance.support);
};
