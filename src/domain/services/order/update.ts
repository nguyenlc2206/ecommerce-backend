// * import libs
import 'reflect-metadata';
import { v4 as uuidv4 } from 'uuid';
import { Container, Service } from 'typedi';

// * import projects
import { Either, success } from '@ecommerce-backend/src/shared/common/either';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { OrderModel } from '@ecommerce-backend/src/domain/models/Order';
import AppError from '@ecommerce-backend/src/shared/common/appError';

// ==============================||  UPDATE ORDER SERVICES IMPLEMENT ||============================== //

export interface UpdateOrderService<Entity> {
    execute(entity: Entity): Promise<Either<OrderModel, AppError>>;
}

@Service()
export class UpdateOrderServiceImpl<Entity extends AccountRequest> implements UpdateOrderService<Entity> {
    constructor() {}

    /** execute function */
    async execute(entity: Entity): Promise<Either<OrderModel, AppError>> {
        return success({} as OrderModel);
    }
}
