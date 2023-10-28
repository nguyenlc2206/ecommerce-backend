// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { GetOrderByIdService, GetOrderByIdServiceImpl } from '@ecommerce-backend/src/domain/services/order/getById';

// ==============================||  GET ORDER CONTROLLER ||============================== //

@Service()
export class GetOrderByIdController {
    /** init services */
    protected getOrderByIdService: GetOrderByIdService<AccountRequest>;

    // * constructor
    constructor() {
        this.getOrderByIdService = Container.get(GetOrderByIdServiceImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: AccountRequest, res: Response, next: NextFunction) => {
        const result = await this.getOrderByIdService.execute(req);
        if (result.isFailure()) return next(result.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Get order from database success',
            DT: { data: result.data }
        });
    });
}
