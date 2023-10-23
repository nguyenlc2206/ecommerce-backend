// * import lib
import { Service } from 'typedi';

// * import projects
import { CategoryModel } from '@ecommerce-backend/src/domain/models/Category';
import { CategoryRepository } from '@ecommerce-backend/src/domain/repositories/category';
import CategoryEntity from '@ecommerce-backend/src/infrastructure/schema/Category';

// ==============================||  CATEGORY REPOSITORY IMPLEMENT ||============================== //

@Service()
export class CategoryRepositoryImpl<T extends CategoryModel> implements CategoryRepository<T> {
    /** constructor */
    constructor() {}

    /** overiding create method */
    async create(entity: T): Promise<T> {
        const result = await new CategoryEntity(entity).save();
        return result as T;
    }

    /** overiding getByName method */
    async getByName(name: string): Promise<T> {
        const result = await CategoryEntity.findOne({ name });
        return result as T;
    }

    /** overiding getById method */
    async getById(id: string): Promise<T> {
        const result = await CategoryEntity.findById(id);
        return result as T;
    }

    /** overiding update method */
    async update(id: string, entity: T): Promise<T> {
        const result = await CategoryEntity.findByIdAndUpdate(id, entity);
        return result as T;
    }

    /** overiding delete method */
    async delete(id: string): Promise<void> {
        const result = await CategoryEntity.findById(id);
        if (result) {
            result.isDeleted = true;
            result.deletedAt = new Date(Date.now());
            await result.save();
        }
    }

    /** overiding getAll method */
    async getAll(): Promise<T[]> {
        // const popObj = {
        //     path: 'categories',
        //     select: 'name'
        // };
        // const result = await AccountEntity.find().populate(popObj);
        const result = await CategoryEntity.find();
        return result as T[];
    }
}
