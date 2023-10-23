// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import { Either, success } from '@ecommerce-backend/src/shared/common/either';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { ProductRepository } from '@ecommerce-backend/src/domain/repositories/products/product';
import { ProductModel } from '@ecommerce-backend/src/domain/models/products/Product';
import { ProductRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/product.impl';

// ==============================||  GET ALL SERVICES IMPLEMENT ||============================== //

export interface GetAllProductService<Entity> {
    execute(): Promise<Either<ProductModel[], AppError>>;
}

@Service()
export class GetAllProductServiceImpl<Entity extends ProductModel> implements GetAllProductService<Entity> {
    protected productRepo: ProductRepository<ProductModel>;

    // * constructor
    constructor() {
        this.productRepo = Container.get(ProductRepositoryImpl);
    }

    /** overiding execute method */
    async execute(): Promise<Either<ProductModel[], AppError>> {
        /** get all category by id */
        const response = await this.productRepo.getAll();
        const _init = new ProductModel();
        const result = _init.fromProductModelGetAll(response);
        return success(result as ProductModel[]);
    }
}
