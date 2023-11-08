// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';
import fs from 'fs';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';

import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { CategoryModel } from '@ecommerce-backend/src/domain/models/Category';
import { CategoryRepository } from '@ecommerce-backend/src/domain/repositories/category';
import { CloudinaryMethods } from '@ecommerce-backend/src/shared/methods/cloudinary';
import { AccountRequest, KeyedObject, ParamsImageType } from '@ecommerce-backend/src/shared/types';
import { Cloudinary } from '@ecommerce-backend/src/shared/common/cloudinary';
import { CategoryRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/category';

// ==============================||  CREATE CATEGORY SERVICES IMPLEMENT ||============================== //

export interface CreateCategoryService<Entity> {
    execute(entity: Entity): Promise<Either<CategoryModel, AppError>>;
}

@Service()
export class CreateCategoryServiceImpl<Entity extends AccountRequest> implements CreateCategoryService<Entity> {
    /** init repository */
    protected categoryRepo: CategoryRepository<CategoryModel>;
    protected cloudinary: CloudinaryMethods<KeyedObject>;

    /** constructor */
    constructor() {
        this.categoryRepo = Container.get(CategoryRepositoryImpl);
        this.cloudinary = Container.get(Cloudinary);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<CategoryModel, AppError>> {
        /** check name in database */
        const resultGet = await this.handleGetCategoryByName(entity?.body?.name);
        if (resultGet.isFailure()) return failure(resultGet.error);

        /** handle cloudinary iamge */
        let img = fs.readFileSync(entity?.file!?.path);
        const params: ParamsImageType = {
            database64: 'data:image/png;base64,' + img.toString('base64'),
            package: 'CategoryImages',
            publicId: entity?.body?.name.toUpperCase()
        };

        const resImage = await this.handleGetLinkImage(params);
        if (resImage.isFailure()) return failure(resImage.error);
        const _entity = { ...entity };

        /** create category */
        const resultCreate = await this.handleCreateCategory(_entity, resImage.data);
        if (resultCreate.isFailure()) return failure(resultCreate.error);

        /** proccessing data */
        const init = new CategoryModel();
        const result = init.fromCategoryModel(resultCreate.data);

        return success(result);
    }

    /** @todo: get category by name */
    private handleGetCategoryByName = async (name?: string): Promise<Either<boolean, AppError>> => {
        const res = await this.categoryRepo.getByName(name!.toUpperCase());
        if (res) return failure(new AppError('Category is exists in database!', 400));
        return success(false);
    };

    //* handle cloudinary iamge
    private handleGetLinkImage = async (params: ParamsImageType): Promise<Either<string, AppError>> => {
        const response = await this.cloudinary.uploadImage(params);
        return success(response?.url);
    };

    // * handle create category
    private handleCreateCategory = async (
        data: AccountRequest,
        image: string
    ): Promise<Either<CategoryModel, AppError>> => {
        const dataCreate = {
            accountId: data?.account?.id,
            image: image,
            name: data?.body?.name.toUpperCase()
        } as CategoryModel;

        const res = await this.categoryRepo.create(dataCreate);
        return success(res);
    };
}
