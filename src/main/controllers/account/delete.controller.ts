// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { DeleteAccountService, DeleteAccountServiceImpl } from '@ecommerce-backend/src/domain/services/account/delete';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';

// ==============================||  DELETE ACCOUNT CONTROLLER ||============================== //
@Service()
export class DeleteAccountController {
    /** init services */
    protected deleteAccountService: DeleteAccountService<AccountRequest>;

    // * constructor
    constructor() {
        this.deleteAccountService = Container.get(DeleteAccountServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        /** execute service */
        const result = await this.deleteAccountService.execute(req);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Delete account success',
            DT: {}
        });
    });
}
