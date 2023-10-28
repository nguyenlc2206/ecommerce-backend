// import lib
import Container, { Service } from 'typedi';

// import projects
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { ProductSizeModel } from '@ecommerce-backend/src/domain/models/products/Size';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { ProductRepository } from '@ecommerce-backend/src/domain/repositories/products/product';
import { ProductRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/product.impl';
import { ProductModel } from '@ecommerce-backend/src/domain/models/products/Product';
import { ProductSizeRepository } from '@ecommerce-backend/src/domain/repositories/products/size';
import { ProductSizeRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/size.impl';

// ==============================||  CREATE PRODUCT SERVICES IMPLEMENT ||============================== //

export interface CreateProductSizeService<Entity> {
    execute(entity: Entity): Promise<Either<ProductSizeModel, AppError>>;
}

@Service()
export class CreateProductSizeServiceImpl<Entity extends AccountRequest> implements CreateProductSizeService<Entity> {
    /** init service */
    protected productRepo: ProductRepository<ProductModel>;
    protected productSizeRepo: ProductSizeRepository<ProductSizeModel>;

    /** constructor */
    constructor() {
        this.productRepo = Container.get(ProductRepositoryImpl);
        this.productSizeRepo = Container.get(ProductSizeRepositoryImpl);
    }

    /** execute function */
    async execute(entity: Entity): Promise<Either<ProductSizeModel, AppError>> {
        /** handle get product with id */
        const resultGet = await this.hanleGetProduct(entity?.body?.productId);
        if (resultGet.isFailure()) return failure(resultGet.error);

        /** create product size */
        const response = await this.productSizeRepo.create({ ...entity?.body });

        return success(response);
    }

    /**@todo: handle get product with id */
    private hanleGetProduct = async (id: string): Promise<Either<ProductModel | undefined, AppError>> => {
        const response = await this.productRepo.getById(id);
        if (!response) return failure(new AppError('Not have product!', 400));
        return success(response);
    };
}
