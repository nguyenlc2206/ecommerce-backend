// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { QueryService, QueryServiceImpl } from '@ecommerce-backend/src/domain/services/product/query';

// ==============================||  GET PRODUCT CONTROLLER ||============================== //

@Service()
export class QueryProductsController {
    /** init services */
    protected queryService: QueryService<AccountRequest>;
    // * constructor
    constructor() {
        this.queryService = Container.get(QueryServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        // * execute service
        const response = await this.queryService.execute(req);
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
