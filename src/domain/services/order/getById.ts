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

// ==============================||  GET ORDER SERVICES IMPLEMENT ||============================== //

export interface GetOrderByIdService<Entity> {
    execute(entity: Entity): Promise<Either<OrderModel, AppError>>;
}

@Service()
export class GetOrderByIdServiceImpl<Entity extends AccountRequest> implements GetOrderByIdService<Entity> {
    protected orderRepo: OrderRepository<OrderModel>;

    // * constructor
    constructor() {
        this.orderRepo = Container.get(OrderRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<OrderModel, AppError>> {
        /** get category by id */
        const resultGet = await this.handleGetOrder(entity?.params?.id);
        if (resultGet.isFailure()) return failure(resultGet.error);

        const _init = new OrderModel();
        const result = _init.fromOrderModel(resultGet.data as OrderModel);
        return success(result);
    }

    // * get accoount from database
    private handleGetOrder = async (id?: string): Promise<Either<OrderModel | undefined, AppError>> => {
        const response = await this.orderRepo.getById(id!);
        if (!response) return failure(new AppError('Order is not already!', 400));
        return success(response);
    };
}
