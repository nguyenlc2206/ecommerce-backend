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

    /** overiding insertMany method */
    async insertMary(entity: T[]): Promise<T[]> {
        const result = await ProductSizeEntity.insertMany(entity);
        return result as unknown as T[];
    }

    /** overiding getByProductIdAndSize method */
    async getByProductIdAndSize(id: string, size: string): Promise<T[]> {
        const popObj = {
            path: 'productId',
            select: 'name id description images',
            populate: {
                path: 'categoryId',
                select: 'name id'
            }
        };
        const result = await ProductSizeEntity.find({ productId: id, size: size }).populate(popObj);
        return result as unknown as T[];
    }

    /** overiding update method */
    async update(id: string, entity: T): Promise<any> {
        let session = await ProductSizeEntity.startSession();
        session.startTransaction();
        const result = await ProductSizeEntity.findByIdAndUpdate(id, entity);
        session.commitTransaction();
        session.endSession();
        return result;
    }

    /** overiding getByProductId method */
    async getByProductId(id: string): Promise<T[]> {
        const popObj = {
            path: 'productId',
            select: 'name id description images',
            populate: {
                path: 'categoryId',
                select: 'name id'
            }
        };
        const result = await ProductSizeEntity.find({ productId: id }).populate(popObj);
        return result as T[];
    }
}
