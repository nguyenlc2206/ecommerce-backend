// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';
import { GetAllAccountService, GetAllAccountServiceImpl } from '@ecommerce-backend/src/domain/services/account/getAll';

// ==============================||  GET ALL ACCOUNT CONTROLLER ||============================== //
@Service()
export class GetAllAccountController {
    /** init services */
    protected getAllAccountService: GetAllAccountService<AccountModel>;

    // * constructor
    constructor() {
        this.getAllAccountService = Container.get(GetAllAccountServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        /** execute getAll */
        const result = await this.getAllAccountService.execute();
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Get all accounts from database success',
            DT: { data: result.data }
        });
    });
}
