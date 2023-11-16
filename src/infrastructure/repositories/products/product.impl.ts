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

    /** overiding update method */
    async update(id: string, entity: T): Promise<T> {
        const result = await ProductEntity.findByIdAndUpdate(id, { ...entity });
        return result as T;
    }

    /** overiding getById method */
    async getById(id: string): Promise<T> {
        const popObj = {
            path: 'ProductSize'
        };
        const popObjCategory = {
            path: 'categoryId'
        };
        const result = await ProductEntity.findById(id).populate(popObj).populate(popObjCategory);
        return result as T;
    }

    /** overiding getById method */
    async getByCategoryId(id: string): Promise<T[]> {
        const popObj = {
            path: 'categoryId'
            // select: 'name'
        };
        const result = await ProductEntity.find({ categoryId: id }).populate(popObj);
        return result as T[];
    }

    /** overiding delete method */
    async delete(id: string): Promise<void> {
        const result = await ProductEntity.findById(id);
        if (result) {
            result.isDeleted = true;
            result.deletedAt = new Date(Date.now());
            await result.save();
        }
    }

    /** overiding getAll method */
    async getAll(): Promise<T[]> {
        const popObj = {
            path: 'ProductSize'
        };
        const popObjCategory = {
            path: 'categoryId'
        };
        const result = await ProductEntity.find().populate(popObj).populate(popObjCategory);
        return result as T[];
    }

    /** overiding find method */
    async find(entity: T): Promise<T[]> {
        const popObjCategory = {
            path: 'categoryId',
            match: entity?.filterCategories
        };
        const popObjProductSize = {
            path: 'ProductSize',
            match: entity?.filterProductSize
        };
        const result = await ProductEntity.find(entity.filter).populate(popObjCategory).populate(popObjProductSize);
        return result as T[];
    }
}
