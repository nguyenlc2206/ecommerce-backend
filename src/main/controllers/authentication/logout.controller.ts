// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';

import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { LogoutService, LogoutServiceImpl } from '@ecommerce-backend/src/domain/services/authentication/logout';

// ==============================||  LOGOUT CONTROLLER CONTROLLER ||============================== //

@Service()
export class LogoutController {
    protected logoutService: LogoutService<AccountRequest>;

    // * constructor
    constructor() {
        this.logoutService = Container.get(LogoutServiceImpl);
    }

    // * execute method
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        /** execte logout service */
        const response = await this.logoutService.execute(req);
        if (response.isFailure()) return next(response.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Logout success',
            DT: {}
        });
    });
}
