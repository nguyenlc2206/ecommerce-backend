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
import { ProductSizeRepository } from '@ecommerce-backend/src/domain/repositories/products/size';
import { ProductSizeModel } from '@ecommerce-backend/src/domain/models/products/Size';
import { ProductSizeRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/size.impl';

// ==============================||  GET PRODUCT SERVICES IMPLEMENT ||============================== //

export interface GetProductByIdAndSizeService<Entity> {
    execute(entity: Entity): Promise<Either<ProductSizeModel[], AppError>>;
}

@Service()
export class GetProductByIdAndSizeServiceImpl<Entity extends AccountRequest>
    implements GetProductByIdAndSizeService<Entity>
{
    protected productRepo: ProductRepository<ProductModel>;
    protected productSizeRepo: ProductSizeRepository<ProductSizeModel>;

    // * constructor
    constructor() {
        this.productRepo = Container.get(ProductRepositoryImpl);
        this.productSizeRepo = Container.get(ProductSizeRepositoryImpl);
    }

    /** @todo: overiding execute method */
    async execute(entity: Entity): Promise<Either<ProductSizeModel[], AppError>> {
        /** get category by id */
        const resultGet = await this.handleGetProduct(entity);
        if (resultGet.isFailure()) return failure(resultGet.error);

        // * handle get product with size
        const resultGetId = await this.hanleGetProductWithSize(entity);
        if (resultGetId.isFailure()) return failure(resultGetId.error);

        return success(resultGetId.data);
    }

    /** @todo: get accoount from database */
    private handleGetProduct = async (data: AccountRequest): Promise<Either<ProductModel | undefined, AppError>> => {
        const response = await this.productRepo.getById(data.query?.id as string);
        if (!response) return failure(new AppError('Product is not already!', 400));
        if (!response?.sizes?.includes(data?.query?.size as string))
            return failure(new AppError('Size product not exists!', 400));
        return success(response);
    };

    /** @todo: handle get product with size */
    private hanleGetProductWithSize = async (data: AccountRequest): Promise<Either<ProductSizeModel[], AppError>> => {
        const response = await this.productSizeRepo.getByProductIdAndSize(
            data?.query?.id as string,
            data?.query?.size as string
        );
        const _init = new ProductSizeModel();
        const result = _init.fromProductModelGetAll(response);
        return success(result);
    };
}
