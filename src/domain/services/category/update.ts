// * import libs
import * as _ from 'lodash';
import 'reflect-metadata';
import { Container, Service } from 'typedi';
import fs from 'fs';

import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { CategoryModel } from '@ecommerce-backend/src/domain/models/Category';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { CategoryRepository } from '@ecommerce-backend/src/domain/repositories/category';
import { CategoryRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/category';
import { AccountRequest, KeyedObject, ParamsImageType } from '@ecommerce-backend/src/shared/types';
import { Cloudinary } from '@ecommerce-backend/src/shared/common/cloudinary';
import { CloudinaryMethods } from '@ecommerce-backend/src/shared/methods/cloudinary';

// ==============================||  UPDATE CATEGORY SERVICES IMPLEMENT ||============================== //

export interface UpdateCategoryService<Entity> {
    execute(entity: Entity): Promise<Either<CategoryModel, AppError>>;
}

@Service()
export class UpdateCategoryServiceImpl<Entity extends AccountRequest> implements UpdateCategoryService<Entity> {
    /** init repo */
    protected categoryRepo: CategoryRepository<CategoryModel>;
    protected cloudinary: CloudinaryMethods<KeyedObject>;

    /** constructor */
    constructor() {
        this.categoryRepo = Container.get(CategoryRepositoryImpl);
        this.cloudinary = Container.get(Cloudinary);
    }

    /** overiding execute */
    async execute(entity: Entity): Promise<Either<CategoryModel, AppError>> {
        /** get category from database */
        const resultGet = await this.handleGetCategory(entity?.params.id);
        if (resultGet.isFailure()) return failure(resultGet.error);
        const { data: category } = resultGet;

        /** handle update image */
        let _entity = {} as CategoryModel;
        if (entity?.file) {
            const resultImage = await this.handleUpdateImage(entity, category);
            if (resultImage.isFailure()) return failure(resultImage.error);
            _entity = resultImage.data;
        }

        /** handle update data */
        _.omit(entity?.body, ['image']);
        const reponse = await this.categoryRepo.update(category?.id, {
            ...entity?.body,
            name: entity?.body?.name.toUpperCase(),
            ..._entity
        });
        const _init = new CategoryModel();
        const result = _init.fromCategoryModelCreate(reponse);

        return success(result);
    }

    // * get category from database
    private handleGetCategory = async (id?: string): Promise<Either<CategoryModel | undefined, AppError>> => {
        const response = await this.categoryRepo.getById(id!);
        if (!response) return failure(new AppError('Category is not exists!', 400));
        return success(response);
    };

    //* handle cloudinary iamge
    private handleGetLinkImage = async (params: ParamsImageType): Promise<Either<string, AppError>> => {
        const response = await this.cloudinary.uploadImage(params);
        return success(response?.url);
    };

    /** handle update image */
    private handleUpdateImage = async (
        entity?: AccountRequest,
        category?: CategoryModel
    ): Promise<Either<CategoryModel, AppError>> => {
        let img = fs.readFileSync(entity?.file!?.path);
        const params: ParamsImageType = {
            database64: 'data:image/png;base64,' + img.toString('base64'),
            package: 'CategoryImages',
            publicId:
                category?.name === entity?.body?.name.toLocaleLowerCase()
                    ? category?.name
                    : entity?.body?.name.toLocaleLowerCase()
        };

        const resImage = await this.handleGetLinkImage(params);
        if (resImage.isFailure()) return failure(resImage.error);
        const _entity = { image: resImage.data } as CategoryModel;
        return success(_entity);
    };
}
