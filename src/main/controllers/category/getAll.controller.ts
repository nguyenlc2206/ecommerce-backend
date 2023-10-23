// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import {
    GetAllCategoryService,
    GetAllCategoryServiceImpl
} from '@ecommerce-backend/src/domain/services/category/getAll';
import { CategoryModel } from '@ecommerce-backend/src/domain/models/Category';

// ==============================||  GET ALL CATEGORY CONTROLLER ||============================== //

@Service()
export class GetAllCategoryController {
    /** init services */
    protected getAllCategoryService: GetAllCategoryService<CategoryModel>;

    // * constructor
    constructor() {
        this.getAllCategoryService = Container.get(GetAllCategoryServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        /** execute getAll */
        const result = await this.getAllCategoryService.execute();
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Get all categories from database success',
            DT: { data: result.data }
        });
    });
}
