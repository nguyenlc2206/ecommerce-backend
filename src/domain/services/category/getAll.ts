// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import { Either, success } from '@ecommerce-backend/src/shared/common/either';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { CategoryRepository } from '@ecommerce-backend/src/domain/repositories/category';
import { CategoryModel } from '@ecommerce-backend/src/domain/models/Category';
import { CategoryRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/category';

// ==============================||  GET ALL SERVICES IMPLEMENT ||============================== //

export interface GetAllCategoryService<Entity> {
    execute(): Promise<Either<CategoryModel[], AppError>>;
}

@Service()
export class GetAllCategoryServiceImpl<Entity extends CategoryModel> implements GetAllCategoryService<Entity> {
    protected categoryRepo: CategoryRepository<CategoryModel>;

    // * constructor
    constructor() {
        this.categoryRepo = Container.get(CategoryRepositoryImpl);
    }

    /** overiding execute method */
    async execute(): Promise<Either<CategoryModel[], AppError>> {
        /** get all category by id */
        const response = await this.categoryRepo.getAll();
        const _init = new CategoryModel();
        const result = _init.fromCategoryModelGetAll(response);
        return success(result as CategoryModel[]);
    }
}
