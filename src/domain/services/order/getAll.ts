// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import { Either, success } from '@ecommerce-backend/src/shared/common/either';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { CategoryModel } from '@ecommerce-backend/src/domain/models/Category';
import { OrderRepository } from '@ecommerce-backend/src/domain/repositories/order';
import { OrderModel } from '@ecommerce-backend/src/domain/models/Order';
import { OrderRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/order';

// ==============================||  GET ALL SERVICES IMPLEMENT ||============================== //

export interface GetAllOrderService<Entity> {
    execute(): Promise<Either<OrderModel[], AppError>>;
}

@Service()
export class GetAllOrderServiceImpl<Entity extends CategoryModel> implements GetAllOrderService<Entity> {
    protected orderRepo: OrderRepository<OrderModel>;

    // * constructor
    constructor() {
        this.orderRepo = Container.get(OrderRepositoryImpl);
    }

    /** overiding execute method */
    async execute(): Promise<Either<OrderModel[], AppError>> {
        /** get all order */
        const response = await this.orderRepo.getAll();
        const _init = new OrderModel();
        const result = _init.fromOrderModelGetAll(response);
        return success(result as OrderModel[]);
    }
}
