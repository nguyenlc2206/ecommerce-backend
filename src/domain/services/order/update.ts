// * import libs
import 'reflect-metadata';
import { v4 as uuidv4 } from 'uuid';
import { Container, Service } from 'typedi';
import * as _ from 'lodash';

// * import projects
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { OrderModel } from '@ecommerce-backend/src/domain/models/Order';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { OrderRepository } from '@ecommerce-backend/src/domain/repositories/order';
import { OrderRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/order';

// ==============================||  UPDATE ORDER SERVICES IMPLEMENT ||============================== //

export interface UpdateOrderService<Entity> {
    execute(entity: Entity): Promise<Either<OrderModel, AppError>>;
}

@Service()
export class UpdateOrderServiceImpl<Entity extends OrderModel> implements UpdateOrderService<Entity> {
    /** init service */
    protected orderRepo: OrderRepository<OrderModel>;

    constructor() {
        this.orderRepo = Container.get(OrderRepositoryImpl);
    }

    /** execute function */
    async execute(entity: Entity): Promise<Either<OrderModel, AppError>> {
        /** get category from database */
        const resultGet = await this.handleGetOrder(entity?.id);
        if (resultGet.isFailure()) return failure(resultGet.error);

        /** handle update order */
        const resultUpdate = await this.handelUpdateOrder(entity?.id, _.omit(entity, ['id']));
        if (resultUpdate.isFailure()) return failure(resultUpdate.error);

        return success(resultUpdate.data);
    }

    // * get order from database
    private handleGetOrder = async (id?: string): Promise<Either<OrderModel | undefined, AppError>> => {
        const response = await this.orderRepo.getById(id!);
        if (!response) return failure(new AppError('Order is not exists!', 400));
        return success(response);
    };

    /** @todo: handle update order to database */
    private handelUpdateOrder = async (id?: string, entity?: OrderModel): Promise<Either<OrderModel, AppError>> => {
        const response = await this.orderRepo.update(id, entity);
        return success(response);
    };
}
