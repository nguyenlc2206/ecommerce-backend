// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';

import { OrderRepository } from '@ecommerce-backend/src/domain/repositories/order';
import { OrderModel } from '@ecommerce-backend/src/domain/models/Order';
import { OrderRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/order.impl';

import { ProductSizeRepository } from '@ecommerce-backend/src/domain/repositories/products/size';
import { ProductSizeModel } from '@ecommerce-backend/src/domain/models/products/Size';
import { ProductSizeRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/size.impl';

// ==============================||  DELETE SERVICES IMPLEMENT ||============================== //

export interface DeleteOrderService<Entity> {
    execute(entity: Entity): Promise<Either<string, AppError>>;
}

@Service()
export class DeleteOrderServiceImpl<Entity extends AccountRequest> implements DeleteOrderService<Entity> {
    /** init repo */
    protected orderRepo: OrderRepository<OrderModel>;
    protected productSizeRepo: ProductSizeRepository<ProductSizeModel>;

    // * constructor
    constructor() {
        this.orderRepo = Container.get(OrderRepositoryImpl);
        this.productSizeRepo = Container.get(ProductSizeRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<string, AppError>> {
        /** handle get order by id */
        const resultGet = await this.hanleGetOrder(entity?.params?.id);
        if (resultGet.isFailure()) return failure(resultGet.error);

        // * handle update product size
        const resultUpdate = this.handleUpdateProductSize(resultGet.data!);

        /** get all account by id */
        const response = await this.orderRepo.delete(entity?.params?.id);
        return success('okie');
    }

    /** handle get order by id */
    private hanleGetOrder = async (id: string): Promise<Either<OrderModel | undefined, AppError>> => {
        const response = await this.orderRepo.getById(id);
        if (!response) return failure(new AppError('Not have order!', 400));
        return success(response);
    };

    /** @todo: handle update product size */
    private handleUpdateProductSize = async (data: OrderModel): Promise<Either<string, AppError>> => {
        data?.orderItems?.map(async (item: any) => {
            const product = await this.productSizeRepo.getByProductIdAndSize(item?.id, item?.size);
            const dataUpdate = {
                totalQty: Number(product[0]?.totalQty) + Number(item?.qty),
                totalSold: Number(product[0]?.totalSold) - Number(item?.qty)
            } as ProductSizeModel;
            await this.productSizeRepo.update(product[0]?.id, dataUpdate);
        });
        return success('okie');
    };
}
