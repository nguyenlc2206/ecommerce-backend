// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { SortProductService, SortProductServiceImpl } from '@ecommerce-backend/src/domain/services/product/sort';

// ==============================||  SORT DISCOUNT PRODUCT CONTROLLER ||============================== //

@Service()
export class SortProductController {
    /** init services */
    protected sortService: SortProductService<AccountRequest>;

    // * constructor
    constructor() {
        this.sortService = Container.get(SortProductServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        /** execute service */
        const result = await this.sortService.execute(req);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Sort product by discount success',
            DT: { data: result.data }
        });
    });
}
