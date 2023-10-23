// * import lib
import { Service } from 'typedi';

// * import projects
import { ProductModel } from '@ecommerce-backend/src/domain/models/products/Product';
import { ProductRepository } from '@ecommerce-backend/src/domain/repositories/products/product';
import ProductEntity from '@ecommerce-backend/src/infrastructure/schema/products/Product';

// ==============================||  PRODUCT REPOSITORY IMPLEMENT ||============================== //

@Service()
export class ProductRepositoryImpl<T extends ProductModel> implements ProductRepository<T> {
    // * constructor
    constructor() {}

    /** overiding create method */
    async create(entity: T): Promise<T> {
        const result = await new ProductEntity(entity).save();
        return result as T;
    }
}
