// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import {
    UpdateProductCardService,
    UpdateProductCardServiceImpl
} from '@ecommerce-backend/src/domain/services/cart/update';
import {
    DeleteProductCartService,
    DeleteProductCartServiceImpl
} from '@ecommerce-backend/src/domain/services/cart/delete';

// ==============================||  DELETE PRODUCT CART CONTROLLER ||============================== //

@Service()
export class DeleteProductCartController {
    // init service
    protected deleteProductCartService: DeleteProductCartService<AccountRequest>;
    // * constructor
    constructor() {
        this.deleteProductCartService = Container.get(DeleteProductCartServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        // * validations fields

        // * execute update product services
        const response = await this.deleteProductCartService.execute(req);
        if (response.isFailure()) return next(response.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Delete product cart to database success',
            DT: { data: response.data }
        });
    });
}
