// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import {
    GetCategoryByIdService,
    GetCategoryByIdServiceImpl
} from '@ecommerce-backend/src/domain/services/category/getById';

// ==============================||  GET CATEGORY CONTROLLER ||============================== //

@Service()
export class GetCategoryByIdController {
    /** init services */
    protected getCategoryService: GetCategoryByIdService<AccountRequest>;

    // * constructor
    constructor() {
        this.getCategoryService = Container.get(GetCategoryByIdServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        const result = await this.getCategoryService.execute(req);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Get category from database success',
            DT: { data: result.data }
        });
    });
}
