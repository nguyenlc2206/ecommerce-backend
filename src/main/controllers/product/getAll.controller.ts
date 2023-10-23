// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { GetAllProductService, GetAllProductServiceImpl } from '@ecommerce-backend/src/domain/services/product/getAll';
import { ProductModel } from '@ecommerce-backend/src/domain/models/products/Product';

// ==============================||  GET ALL PRODUCT CONTROLLER ||============================== //

@Service()
export class GetAllProductController {
    /** init services */
    protected getAllProductsService: GetAllProductService<ProductModel>;

    // * constructor
    constructor() {
        this.getAllProductsService = Container.get(GetAllProductServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        /** execute getAll */
        const result = await this.getAllProductsService.execute();
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Get all products from database success',
            DT: { data: result.data }
        });
    });
}
