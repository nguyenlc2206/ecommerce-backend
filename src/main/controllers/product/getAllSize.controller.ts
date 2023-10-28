// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import {
    GetAllProductSizeService,
    GetAllProductSizeServiceImpl
} from '@ecommerce-backend/src/domain/services/product/getAllSize';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';

// ==============================||  GET ALL PRODUCT CONTROLLER ||============================== //

@Service()
export class GetAllSizeProductController {
    /** init services */
    protected getAllProductSizeService: GetAllProductSizeService<AccountRequest>;

    // * constructor
    constructor() {
        this.getAllProductSizeService = Container.get(GetAllProductSizeServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        /** execute getAll */
        const result = await this.getAllProductSizeService.execute(req);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Get all products size from database success',
            DT: { data: result.data }
        });
    });
}
