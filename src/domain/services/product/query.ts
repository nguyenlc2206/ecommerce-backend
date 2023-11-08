// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { ProductModel } from '@ecommerce-backend/src/domain/models/products/Product';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { ProductRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/product.impl';
import { ProductRepository } from '@ecommerce-backend/src/domain/repositories/products/product';

// ==============================||  QUERY SERVICES IMPLEMENT ||============================== //

export interface QueryService<Entity> {
    execute(entity: Entity): Promise<Either<ProductModel[], AppError>>;
}

@Service()
export class QueryServiceImpl<Entity extends AccountRequest> implements QueryService<Entity> {
    // init repo
    protected productRepo: ProductRepository<ProductModel>;
    // constructor
    constructor() {
        this.productRepo = Container.get(ProductRepositoryImpl);
    }

    // execute
    async execute(entity: Entity): Promise<Either<ProductModel[], AppError>> {
        // handle query
        const resultQuery = await this.handleQuery(entity);
        if (resultQuery.isFailure()) return failure(resultQuery.error);

        const _init = new ProductModel();
        const result = _init.fromProductModelGetAll(resultQuery.data);
        return success(result);
    }

    // processing feature
    private handleQuery = async (req: AccountRequest): Promise<Either<ProductModel[], AppError>> => {
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);

        // 1B) Advanced filtering
        let queryStr = JSON.stringify({ filter: queryObj });
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        // execute query
        const res = await this.productRepo.find(JSON.parse(queryStr));
        if (!res.length) return failure(new AppError('Not have products!', 400));
        return success(res);
    };
}
