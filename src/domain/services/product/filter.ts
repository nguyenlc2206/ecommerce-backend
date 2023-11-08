// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';
import * as _ from 'lodash';

// import projects
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { ProductModel } from '@ecommerce-backend/src/domain/models/products/Product';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { ProductRepository } from '@ecommerce-backend/src/domain/repositories/products/product';
import { ProductRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/product.impl';
import { ProductSizeRepository } from '@ecommerce-backend/src/domain/repositories/products/size';
import { ProductSizeModel } from '@ecommerce-backend/src/domain/models/products/Size';
import { ProductSizeRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/size.impl';

// ==============================||  FILTER SERVICES IMPLEMENT ||============================== //

export interface FilterService<Entity> {
    execute(entity: Entity): Promise<Either<ProductModel[], AppError>>;
}

@Service()
export class FilterServiceImpl<Entity extends AccountRequest> implements FilterService<Entity> {
    // init repo
    protected productRepo: ProductRepository<ProductModel>;
    protected productSizeRepo: ProductSizeRepository<ProductSizeModel>;
    // constructor
    constructor() {
        this.productRepo = Container.get(ProductRepositoryImpl);
        this.productSizeRepo = Container.get(ProductSizeRepositoryImpl);
    }

    // execute function
    async execute(entity: Entity): Promise<Either<ProductModel[], AppError>> {
        let result: Array<ProductModel> = [];
        const _init = new ProductModel();
        if (entity?.body?.categories.length || entity?.body?.colors.length) {
            const resultGet = await this.handleFeatures(entity);
            if (resultGet.isFailure()) return failure(resultGet.error);
            result = _init.fromProductModelFilter(resultGet.data);
        } else {
            const response = await this.productRepo.getAll();
            result = _init.fromProductModelGetAll(response);
        }

        return success(result);
    }

    // handle features filter
    private handleFeatures = async (req: AccountRequest): Promise<Either<ProductModel[], AppError>> => {
        const optionsSize = {
            filterCategories: { _id: { $in: req.body?.categories } },
            filterProductSize: { color: { $in: req.body?.colors } }
        };
        if (!req.body?.colors.length) _.unset(optionsSize, ['filterProductSize']);
        if (!req.body?.categories.length) _.unset(optionsSize, ['filterCategories']);

        let queryStrSize = JSON.stringify(optionsSize);
        queryStrSize = queryStrSize.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        const resSize = await this.productRepo.find(JSON.parse(queryStrSize));
        return success(resSize);
    };
}
