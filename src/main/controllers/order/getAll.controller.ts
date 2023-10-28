// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { CategoryModel } from '@ecommerce-backend/src/domain/models/Category';
import { GetAllOrderService, GetAllOrderServiceImpl } from '@ecommerce-backend/src/domain/services/order/getAll';

// ==============================||  GET ALL ORDER CONTROLLER ||============================== //

@Service()
export class GetAllOrderController {
    /** init services */
    protected getAllOrderService: GetAllOrderService<CategoryModel>;

    // * constructor
    constructor() {
        this.getAllOrderService = Container.get(GetAllOrderServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        /** execute getAll */
        const result = await this.getAllOrderService.execute();
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Get all orders from database success',
            DT: { data: result.data }
        });
    });
}
