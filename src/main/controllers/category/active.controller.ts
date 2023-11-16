// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import {
    ActiveCategoryService,
    ActiveCategoryServiceImpl
} from '@ecommerce-backend/src/domain/services/category/active';

// ==============================||  ACTIVE CATEGORY CONTROLLER ||============================== //

@Service()
export class ActiveCategoryController {
    /** init services */
    protected activeCategoryService: ActiveCategoryService<AccountRequest>;

    // * constructor
    constructor() {
        this.activeCategoryService = Container.get(ActiveCategoryServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        /** execute service */
        const result = await this.activeCategoryService.execute(req);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Active category success',
            DT: {}
        });
    });
}
