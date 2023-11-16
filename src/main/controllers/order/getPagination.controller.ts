// * import lib
import * as _ from 'lodash';
import { Container, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

// * import projects
import catchAsync from '@ecommerce-backend/src/shared/common/catchAsync';
import {
    GetPaginateOrderService,
    GetPaginateOrderServiceImpl
} from '@ecommerce-backend/src/domain/services/order/getPaginate';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { OrderRepository } from '@ecommerce-backend/src/domain/repositories/order';
import { OrderModel } from '@ecommerce-backend/src/domain/models/Order';
import { OrderRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/order.impl';

// ==============================||  GET PAGINATION ORDER CONTROLLER ||============================== //

@Service()
export class GetPaginationOrderController {
    /** init services */
    protected getPaginateService: GetPaginateOrderService<AccountRequest>;
    protected orderRepo: OrderRepository<OrderModel>;

    // * constructor
    constructor() {
        this.getPaginateService = Container.get(GetPaginateOrderServiceImpl);
        this.orderRepo = Container.get(OrderRepositoryImpl);
    }

    /** execute method */
    execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // * total
        const total = await this.orderRepo.getTotal();

        /** execute getAll */
        const response = await this.getPaginateService.execute(req);
        if (response.isFailure()) return next(response.error);

        // * processing response
        res.status(200).json({
            status: 'success',
            EC: 200,
            EM: '',
            MS: 'Get orders from database success',
            DT: { data: response.data, total: total }
        });
    });
}
