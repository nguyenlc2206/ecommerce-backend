// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import {
    GetProductByIdService,
    GetProductByIdServiceImpl
} from '@ecommerce-backend/src/domain/services/product/getById';

// ==============================||  GET PRODUCT CONTROLLER ||============================== //

@Service()
export class GetProductByIdController {
    /** init services */
    protected getProductService: GetProductByIdService<AccountRequest>;

    // * constructor
    constructor() {
        this.getProductService = Container.get(GetProductByIdServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        const result = await this.getProductService.execute(req);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Get product from database success',
            DT: { data: result.data }
        });
    });
}
