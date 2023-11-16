// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { ActiveAccountService, ActiveAccountServiceImpl } from '@ecommerce-backend/src/domain/services/account/active';

// ==============================||  ACTIVE ACCOUNT CONTROLLER ||============================== //
@Service()
export class ActiveAccountController {
    /** init services */
    protected activeAccountService: ActiveAccountService<AccountRequest>;

    // * constructor
    constructor() {
        this.activeAccountService = Container.get(ActiveAccountServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        /** execute service */
        const result = await this.activeAccountService.execute(req);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Active account success',
            DT: {}
        });
    });
}
