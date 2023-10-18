// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import {
    GetAccountByIdService,
    GetAccountByIdServiceImpl
} from '@ecommerce-backend/src/domain/services/account/getById';

// ==============================||  GET ACCOUNT CONTROLLER ||============================== //

@Service()
export class GetAccountByIdController {
    /** init services */
    protected getAccountByIdService: GetAccountByIdService<AccountRequest>;

    // * constructor
    constructor() {
        this.getAccountByIdService = Container.get(GetAccountByIdServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        const result = await this.getAccountByIdService.execute(req);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Get account from database success',
            DT: { data: result.data }
        });
    });
}
