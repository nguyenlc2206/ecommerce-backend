// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import {
    CreateCategoryService,
    CreateCategoryServiceImpl
} from '@ecommerce-backend/src/domain/services/category/create';
import { Validation } from '@ecommerce-backend/src/shared/common/validations';
import { ValidationCreateCategory } from '../validations/category/create';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';

// ==============================||  CREATE CATEGORY CONTROLLER ||============================== //

@Service()
export class CreateCategoryController {
    /** init services */
    protected createCategoryService: CreateCategoryService<AccountRequest>;
    protected validations: Validation = new ValidationCreateCategory();

    /** constructor */
    constructor() {
        this.createCategoryService = Container.get(CreateCategoryServiceImpl);
    }

    /** overding execute function */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        /** validation */
        const validation = this.validations.execute(req);
        if (validation) return next(validation);

        /** execute create category */
        const response = await this.createCategoryService.execute(req);
        if (response.isFailure()) return next(response.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Insert category to database success',
            DT: { data: response.data }
        });
    });
}
