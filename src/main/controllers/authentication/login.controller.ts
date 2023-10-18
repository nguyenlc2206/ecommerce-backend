// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { Validation } from '@ecommerce-backend/src/shared/common/validations';
import { ValidationLogin } from '@ecommerce-backend/src/main/controllers/validations/authentication/login';
import { LoginService, LoginServiceImpl } from '@ecommerce-backend/src/domain/services/authentication/login';
import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';

// ==============================||  LOGIN CONTROLLER CONTROLLER ||============================== //

@Service()
export class LoginController {
    protected validation: Validation = new ValidationLogin();
    protected loginService: LoginService<AccountModel>;

    // * constructor
    constructor() {
        this.loginService = Container.get(LoginServiceImpl);
    }

    // * execute method
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // * validations fields
        const validations = this.validation.execute(req);
        if (validations) return next(validations);

        // * login account services
        const data: AccountModel = { ...req.body };
        const result = await this.loginService.execute(data);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Login success',
            DT: {
                data: result.data
            }
        });
    });
}
