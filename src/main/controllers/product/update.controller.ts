// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { Validation } from '@ecommerce-backend/src/shared/common/validations';
import { ValidationUpdateProduct } from '@ecommerce-backend/src/main/controllers/validations/product/update';
import { UpdateProductService, UpdateProductServiceImpl } from '@ecommerce-backend/src/domain/services/product/update';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';

// ==============================||  UPDATE PRODUCT CONTROLLER ||============================== //

@Service()
export class UpdateProductController {
    /** init validation */
    protected validation: Validation = new ValidationUpdateProduct();
    protected updateProductService: UpdateProductService<AccountRequest>;

    // * constructor
    constructor() {
        this.updateProductService = Container.get(UpdateProductServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        // * validations fields
        const validation = this.validation.execute(req);
        if (validation) return next(validation);

        // * execute update product services
        const response = await this.updateProductService.execute(req);
        if (response.isFailure()) return next(response.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Update product to database success',
            DT: { data: {} }
        });
    });
}
