// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { CategoryRepository } from '@ecommerce-backend/src/domain/repositories/category';
import { CategoryRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/category';
import { CategoryModel } from '@ecommerce-backend/src/domain/models/Category';

// ==============================||  DELETE SERVICES IMPLEMENT ||============================== //

export interface DeleteCategoryService<Entity> {
    execute(entity: Entity): Promise<Either<string, AppError>>;
}

@Service()
export class DeleteCategoryServiceImpl<Entity extends AccountRequest> implements DeleteCategoryService<Entity> {
    protected categoryRepo: CategoryRepository<CategoryModel>;

    // * constructor
    constructor() {
        this.categoryRepo = Container.get(CategoryRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<string, AppError>> {
        /** handle get account by id */
        const resultGet = await this.hanleGetCategory(entity?.params?.id);
        if (resultGet.isFailure()) return failure(resultGet.error);

        /** get all account by id */
        const response = await this.categoryRepo.delete(entity?.params?.id);
        return success('okie');
    }

    /** handle get account by id */
    private hanleGetCategory = async (id: string): Promise<Either<CategoryModel | undefined, AppError>> => {
        const response = await this.categoryRepo.getById(id);
        if (!response) return failure(new AppError('Not have category!', 400));
        return success(response);
    };
}
