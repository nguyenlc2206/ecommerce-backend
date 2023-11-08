// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import {
    CreateProductCartService,
    CreateProductCartServiceImpl
} from '@ecommerce-backend/src/domain/services/cart/create';

// ==============================||  CREATE PRODUCT CART CONTROLLER ||============================== //

@Service()
export class CreateProductCartController {
    /** init validation */
    protected createProductCartService: CreateProductCartService<AccountRequest>;

    // * constructor
    constructor() {
        this.createProductCartService = Container.get(CreateProductCartServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // * validations fields

        // * execute create product services
        const response = await this.createProductCartService.execute(req);
        if (response.isFailure()) return next(response.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Insert product to cart success',
            DT: { data: response.data }
        });
    });
}
