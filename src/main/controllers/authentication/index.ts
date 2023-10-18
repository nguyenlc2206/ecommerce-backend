// * import libs
import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import { LoginController } from '@ecommerce-backend/src/main/controllers/authentication/login.controller';
import { ProtectedRoutesController } from '@ecommerce-backend/src/main/controllers/authentication/protect.controller';
import { ChangePasswordController } from '@ecommerce-backend/src/main/controllers/authentication/changePassword.controller';
import { ForgotPasswordController } from '@ecommerce-backend/src/main/controllers/authentication/forgotPassword.controller';

// ==============================||  AUTHENTICATION CONTROLLER ||============================== //

@Service()
export class AuthenticationController {
    /** constructor */
    constructor() {}

    /** login method */
    login = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new LoginController();
        return _init.execute(req, res, next);
    };

    /** protect router */
    protect = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new ProtectedRoutesController();
        return _init.execute(req, res, next);
    };

    /** change password router */
    changePassword = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new ChangePasswordController();
        return _init.execute(req, res, next);
    };

    /** forgot password router */
    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        const _init = new ForgotPasswordController();
        return _init.execute(req, res, next);
    };
}
