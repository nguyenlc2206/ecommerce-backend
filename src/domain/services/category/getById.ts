// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { CategoryRepository } from '@ecommerce-backend/src/domain/repositories/category';
import { CategoryModel } from '@ecommerce-backend/src/domain/models/Category';
import { CategoryRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/category';

// ==============================||  GET CATEGORY SERVICES IMPLEMENT ||============================== //

export interface GetCategoryByIdService<Entity> {
    execute(entity: Entity): Promise<Either<CategoryModel, AppError>>;
}

@Service()
export class GetCategoryByIdServiceImpl<Entity extends AccountRequest> implements GetCategoryByIdService<Entity> {
    protected categoryRepo: CategoryRepository<CategoryModel>;

    // * constructor
    constructor() {
        this.categoryRepo = Container.get(CategoryRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<CategoryModel, AppError>> {
        /** get category by id */
        const resultGet = await this.handleGetCategory(entity?.params?.id);
        if (resultGet.isFailure()) return failure(resultGet.error);

        const _init = new CategoryModel();
        const result = _init.fromCategoryModelCreate(resultGet.data as CategoryModel);
        return success(result);
    }

    // * get accoount from database
    private handleGetCategory = async (id?: string): Promise<Either<CategoryModel | undefined, AppError>> => {
        const response = await this.categoryRepo.getById(id!);
        if (!response) return failure(new AppError('Category is not already!', 400));
        return success(response);
    };
}
