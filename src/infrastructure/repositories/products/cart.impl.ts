// * import lib
import { Service } from 'typedi';

// * import projects
import { ProductCartRepository } from '@ecommerce-backend/src/domain/repositories/products/cart';
import { ProductCartModel } from '@ecommerce-backend/src/domain/models/products/Cart';
import ProductCartEntity from '@ecommerce-backend/src/infrastructure/schema/products/Cart';

// ==============================||  PRODUCT CART REPOSITORY IMPLEMENT ||============================== //

@Service()
export class ProductCartRepositoryImpl<T extends ProductCartModel> implements ProductCartRepository<T> {
    // * constructor
    constructor() {}

    /** overiding create method */
    async create(entity: T): Promise<T> {
        const result = await new ProductCartEntity(entity).save();
        return result as T;
    }

    /** overiding update method */
    async update(id: string, entity: T): Promise<any> {
        let session = await ProductCartEntity.startSession();
        session.startTransaction();
        const result = await ProductCartEntity.findByIdAndUpdate(id, entity);
        session.commitTransaction();
        session.endSession();
        return result;
    }

    /** overiding find method */
    async find(entity: T): Promise<T[]> {
        const result = await ProductCartEntity.find();
        return result as T[];
    }

    /** overring get cart by account id */
    async getCartByAccountId(id: string): Promise<T> {
        const result = await ProductCartEntity.findOne({ accountId: id });
        return result as T;
    }

    /** overiding delete method */
    async delete(id: string): Promise<void> {
        const result = await ProductCartEntity.findById(id);
        if (result) {
            result.isDeleted = true;
            result.deletedAt = new Date(Date.now());
            await result.save();
        }
    }
}
