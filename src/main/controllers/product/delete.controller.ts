// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { DeleteProductService, DeleteProductServiceImpl } from '@ecommerce-backend/src/domain/services/product/delete';

// ==============================||  DELETE PRODUCT CONTROLLER ||============================== //

@Service()
export class DeleteProductController {
    /** init services */
    protected deleteProductService: DeleteProductService<AccountRequest>;

    // * constructor
    constructor() {
        this.deleteProductService = Container.get(DeleteProductServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        /** execute service */
        const result = await this.deleteProductService.execute(req);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Delete product success',
            DT: {}
        });
    });
}
