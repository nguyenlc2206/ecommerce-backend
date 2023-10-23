// * import lib
import { Service } from 'typedi';

// * import projects
import { ProductSizeModel } from '@ecommerce-backend/src/domain/models/products/Size';
import { ProductSizeRepository } from '@ecommerce-backend/src/domain/repositories/products/size';
import ProductSizeEntity from '@ecommerce-backend/src/infrastructure/schema/products/Size';

// ==============================||  PRODUCT SIZE REPOSITORY IMPLEMENT ||============================== //

@Service()
export class ProductSizeRepositoryImpl<T extends ProductSizeModel> implements ProductSizeRepository<T> {
    // * constructor
    constructor() {}

    /** overiding create method */
    async create(entity: T): Promise<T> {
        const result = await new ProductSizeEntity(entity).save();
        return result as T;
    }
}
