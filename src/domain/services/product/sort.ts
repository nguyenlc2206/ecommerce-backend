// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';

import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { ProductSizeRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/size.impl';
import { ProductSizeModel } from '@ecommerce-backend/src/domain/models/products/Size';
import { ProductSizeRepository } from '@ecommerce-backend/src/domain/repositories/products/size';

// ==============================||  SORT DISCOUNT SERVICES IMPLEMENT ||============================== //

export interface SortProductService<Entity> {
    execute(entity: Entity): Promise<Either<ProductSizeModel[], AppError>>;
}

@Service()
export class SortProductServiceImpl<Entity extends AccountRequest> implements SortProductService<Entity> {
    /** init repo */
    protected productSizeRepo: ProductSizeRepository<ProductSizeModel>;

    // * constructor
    constructor() {
        this.productSizeRepo = Container.get(ProductSizeRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<ProductSizeModel[], AppError>> {
        const res = await this.productSizeRepo.sort();
        const _init = new ProductSizeModel();
        const result = _init.fromProductModelGetAll(res);
        // console.log(result);
        return success(result);
    }
}
