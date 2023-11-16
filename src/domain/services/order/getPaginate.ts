// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';

import { OrderModel } from '@ecommerce-backend/src/domain/models/Order';
import { OrderRepository } from '@ecommerce-backend/src/domain/repositories/order';
import { OrderRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/order.impl';

// ==============================||  GET PAGINATE ORDER SERVICES IMPLEMENT ||============================== //

export interface GetPaginateOrderService<Entity> {
    execute(entity: Entity): Promise<Either<OrderModel[], AppError>>;
}

@Service()
export class GetPaginateOrderServiceImpl<Entity extends AccountRequest> implements GetPaginateOrderService<Entity> {
    /** init services */
    protected orderRepo: OrderRepository<OrderModel>;

    // * constructor
    constructor() {
        this.orderRepo = Container.get(OrderRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<OrderModel[], AppError>> {
        // * page
        const page = Number(entity?.query?.page) ? Number(entity?.query?.page) : 1;
        // * limit
        const limit = Number(entity?.query?.limit) ? Number(entity?.query?.limit) : 10;
        //startIdx
        const startIndex = (page - 1) * limit;
        // * endIdx
        const endIndex = page * limit;
        // * total
        const total = await this.orderRepo.getTotal();
        // * processing data
        const orderQuery = await this.orderRepo.getPaginate(startIndex, limit);
        const _init = new OrderModel();
        const result = _init.fromOrderModelGetAll(orderQuery);

        return success(result);
    }
}
