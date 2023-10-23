// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { ValidationCreateProduct } from '@ecommerce-backend/src/main/controllers/validations/product/create';

// ==============================||  CREATE PRODUCT CONTROLLER ||============================== //

@Service()
export class CreateProductController {
    protected validation = new ValidationCreateProduct();

    // * constructor
    constructor() {}

    /** execute method */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // * validations fields
        const validation = this.validation.execute(req);
        if (validation) return next(validation);
        // * execute crate product services

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Insert product to database success',
            DT: { data: {} }
        });
    });
}
