// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { ValidationCreateProduct } from '@ecommerce-backend/src/main/controllers/validations/product/create';
import { CreateProductService, CreateProductServiceImpl } from '@ecommerce-backend/src/domain/services/product/create';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';

// ==============================||  CREATE PRODUCT CONTROLLER ||============================== //

@Service()
export class CreateProductController {
    /** init validation */
    protected validation = new ValidationCreateProduct();
    protected craeteProductService: CreateProductService<AccountRequest>;

    // * constructor
    constructor() {
        this.craeteProductService = Container.get(CreateProductServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // * validations fields
        const validation = this.validation.execute(req);
        if (validation) return next(validation);

        // * execute create product services
        const response = await this.craeteProductService.execute(req);
        if (response.isFailure()) return next(response.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Insert product to database success',
            DT: { data: response.data }
        });
    });
}
