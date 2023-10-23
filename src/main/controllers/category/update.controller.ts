// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import {
    UpdateCategoryService,
    UpdateCategoryServiceImpl
} from '@ecommerce-backend/src/domain/services/category/update';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { Validation } from '@ecommerce-backend/src/shared/common/validations';
import { ValidationUpdateCategory } from '@ecommerce-backend/src/main/controllers/validations/category/update';

// ==============================||  UPDATE CATEGORY CONTROLLER ||============================== //

@Service()
export class UpdateCategoryController {
    /** init services */
    protected updateCategoryService: UpdateCategoryService<AccountRequest>;
    protected validation: Validation = new ValidationUpdateCategory();

    /** constructor */
    constructor() {
        this.updateCategoryService = Container.get(UpdateCategoryServiceImpl);
    }

    /** overding execute function */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        /** validation */
        const validation = this.validation.execute(req);
        if (validation) return next(validation);

        /** execute create category */
        const response = await this.updateCategoryService.execute(req);
        if (response.isFailure()) return next(response.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Update category to database success',
            DT: { data: {} }
        });
    });
}
