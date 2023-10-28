// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import { Either, success } from '@ecommerce-backend/src/shared/common/either';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { ProductSizeModel } from '@ecommerce-backend/src/domain/models/products/Size';
import { ProductSizeRepository } from '@ecommerce-backend/src/domain/repositories/products/size';
import { ProductSizeRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/size.impl';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';

// ==============================||  GET ALL SERVICES IMPLEMENT ||============================== //

export interface GetAllProductSizeService<Entity> {
    execute(entity: Entity): Promise<Either<ProductSizeModel[], AppError>>;
}

@Service()
export class GetAllProductSizeServiceImpl<Entity extends AccountRequest> implements GetAllProductSizeService<Entity> {
    protected productSizeRepo: ProductSizeRepository<ProductSizeModel>;

    // * constructor
    constructor() {
        this.productSizeRepo = Container.get(ProductSizeRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<ProductSizeModel[], AppError>> {
        /** get all category by id */
        const response = await this.productSizeRepo.getByProductId(entity?.params?.id);
        const _init = new ProductSizeModel();
        const result = _init.fromProductModelGetAll(response);
        return success(result as ProductSizeModel[]);
    }
}
