// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { ValidationCreateProductSize } from '@ecommerce-backend/src/main/controllers/validations/product/createSize';
import {
    CreateProductSizeService,
    CreateProductSizeServiceImpl
} from '@ecommerce-backend/src/domain/services/product/createSize';

// ==============================||  CREATE PRODUCT SIZE CONTROLLER ||============================== //

@Service()
export class CreateProductSizeController {
    /** init validation */
    protected validation = new ValidationCreateProductSize();
    protected createProductService: CreateProductSizeService<AccountRequest>;

    // * constructor
    constructor() {
        this.createProductService = Container.get(CreateProductSizeServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // * validations fields
        const validation = this.validation.execute(req);
        if (validation) return next(validation);

        // * execute create product services
        const response = await this.createProductService.execute(req);
        if (response.isFailure()) return next(response.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Insert product size to database success',
            DT: { data: response.data }
        });
    });
}
