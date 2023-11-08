// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import {
    GetProductCartByAccountIdService,
    GetProductCartByAccountIdServiceImpl
} from '@ecommerce-backend/src/domain/services/cart/getByAccountId';

// ==============================||  GET PRODUCT CART CONTROLLER ||============================== //

@Service()
export class GetProductCartByAccountIdController {
    /** init validation */
    protected getProductCartService: GetProductCartByAccountIdService<AccountRequest>;

    // * constructor
    constructor() {
        this.getProductCartService = Container.get(GetProductCartByAccountIdServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // * validations fields

        // * execute create product services
        const response = await this.getProductCartService.execute(req);
        if (response.isFailure()) return next(response.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Get product cart success',
            DT: { data: response.data }
        });
    });
}
