// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';

import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { ProductRepository } from '@ecommerce-backend/src/domain/repositories/products/product';
import { ProductModel } from '@ecommerce-backend/src/domain/models/products/Product';
import { ProductRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/product.impl';

// ==============================||  ACTIVE SERVICES IMPLEMENT ||============================== //

export interface ActiveProductService<Entity> {
    execute(entity: Entity): Promise<Either<string, AppError>>;
}

@Service()
export class ActiveProductServiceImpl<Entity extends AccountRequest> implements ActiveProductService<Entity> {
    /** init repo */
    protected productRepo: ProductRepository<ProductModel>;

    // * constructor
    constructor() {
        this.productRepo = Container.get(ProductRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<string, AppError>> {
        /** handle get product by id */
        const resultGet = await this.hanleGetProduct(entity?.params?.id);
        if (resultGet.isFailure()) return failure(resultGet.error);

        /** get all account by id */
        if (resultGet.data?.isDeleted) {
            const response = await this.productRepo.update(entity?.params?.id, {
                isDeleted: false,
                deletedAt: null
            } as ProductModel);
        }
        return success('okie');
    }

    /** handle get product by id */
    private hanleGetProduct = async (id: string): Promise<Either<ProductModel | undefined, AppError>> => {
        const response = await this.productRepo.getById(id);
        if (!response) return failure(new AppError('Not have product!', 400));
        return success(response);
    };
}
