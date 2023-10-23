// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { DeleteCategoryServiceImpl } from '@ecommerce-backend/src/domain/services/category/delete';

// ==============================||  DELETE CATEGORY CONTROLLER ||============================== //
@Service()
export class DeleteCategoryController {
    /** init services */
    protected deleteCategoryService: DeleteCategoryServiceImpl<AccountRequest>;

    // * constructor
    constructor() {
        this.deleteCategoryService = Container.get(DeleteCategoryServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        /** execute service */
        const result = await this.deleteCategoryService.execute(req);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Delete category success',
            DT: {}
        });
    });
}
