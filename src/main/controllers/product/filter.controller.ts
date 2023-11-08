// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { FilterService, FilterServiceImpl } from '@ecommerce-backend/src/domain/services/product/filter';

// ==============================||  FILTER PRODUCT CONTROLLER ||============================== //

@Service()
export class FilterProductsController {
    /** init services */
    protected filterService: FilterService<AccountRequest>;
    // * constructor
    constructor() {
        this.filterService = Container.get(FilterServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        // * execute service
        const response = await this.filterService.execute(req);
        if (response.isFailure()) return next(response.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Get product from database success',
            DT: { data: response.data }
        });
    });
}
