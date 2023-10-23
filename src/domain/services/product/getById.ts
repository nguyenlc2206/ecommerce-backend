// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { ProductModel } from '@ecommerce-backend/src/domain/models/products/Product';
import { ProductRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/product.impl';
import { ProductRepository } from '@ecommerce-backend/src/domain/repositories/products/product';

// ==============================||  GET PRODUCT SERVICES IMPLEMENT ||============================== //

export interface GetProductByIdService<Entity> {
    execute(entity: Entity): Promise<Either<ProductModel, AppError>>;
}

@Service()
export class GetProductByIdServiceImpl<Entity extends AccountRequest> implements GetProductByIdService<Entity> {
    protected productRepo: ProductRepository<ProductModel>;

    // * constructor
    constructor() {
        this.productRepo = Container.get(ProductRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<ProductModel, AppError>> {
        /** get category by id */
        const resultGet = await this.handleGetProduct(entity?.params?.id);
        if (resultGet.isFailure()) return failure(resultGet.error);

        const _init = new ProductModel();
        const result = _init.fromProductModel(resultGet.data as ProductModel);
        return success(result);
    }

    // * get accoount from database
    private handleGetProduct = async (id?: string): Promise<Either<ProductModel | undefined, AppError>> => {
        const response = await this.productRepo.getById(id!);
        // console.log('>>>Check res:', response);
        if (!response) return failure(new AppError('Product is not already!', 400));
        return success(response);
    };
}
