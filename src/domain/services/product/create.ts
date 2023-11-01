// * import libs
import 'reflect-metadata';
import * as _ from 'lodash';
import fs from 'fs';

import { v4 as uuidv4 } from 'uuid';
import { Container, Service } from 'typedi';

// * import projects
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { ProductModel } from '@ecommerce-backend/src/domain/models/products/Product';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { CloudinaryMethods } from '@ecommerce-backend/src/shared/methods/cloudinary';
import { AccountRequest, KeyedObject, ParamsImageType } from '@ecommerce-backend/src/shared/types';
import { ProductRepository } from '@ecommerce-backend/src/domain/repositories/products/product';
import { Cloudinary } from '@ecommerce-backend/src/shared/common/cloudinary';
import { ProductRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/product.impl';
import { ProductSizeRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/size.impl';
import { ProductSizeModel } from '@ecommerce-backend/src/domain/models/products/Size';
import { CategoryRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/category';
import { CategoryModel } from '@ecommerce-backend/src/domain/models/Category';
import { ProductSizeRepository } from '@ecommerce-backend/src/domain/repositories/products/size';
import { CategoryRepository } from '@ecommerce-backend/src/domain/repositories/category';

// ==============================||  CREATE PRODUCT SERVICES IMPLEMENT ||============================== //

export interface CreateProductService<Entity> {
    execute(entity: Entity): Promise<Either<ProductModel, AppError>>;
}

@Service()
export class CreateProductServiceImpl<Entity extends AccountRequest> implements CreateProductService<Entity> {
    /** init repo, store */
    protected cloudinary: CloudinaryMethods<KeyedObject>;
    protected productRepo: ProductRepository<ProductModel>;
    protected productSizeRepo: ProductSizeRepository<ProductSizeModel>;
    protected categoryRepo: CategoryRepository<CategoryModel>;

    /** constructor */
    constructor() {
        this.cloudinary = Container.get(Cloudinary);
        this.productRepo = Container.get(ProductRepositoryImpl);
        this.productSizeRepo = Container.get(ProductSizeRepositoryImpl);
        this.categoryRepo = Container.get(CategoryRepositoryImpl);
    }

    /** execute function */
    async execute(entity: Entity): Promise<Either<ProductModel, AppError>> {
        /** handle check category */
        const resultGet = await this.handleGetCategory(entity?.body?.categoryId);
        if (resultGet.isFailure()) return failure(resultGet.error);

        /** save product */
        const result = await this.hanleSaveProduct(entity);
        if (result.isFailure()) return failure(result.error);

        /** handle save product size */
        const resultSave = this.handleSaveProductSize(entity, result?.data?.id);

        return success(result.data);
    }

    /** @todo: handle check category */
    private handleGetCategory = async (id: string): Promise<Either<boolean, AppError>> => {
        const result = await this.categoryRepo.getById(id);
        if (!result) return failure(new AppError('Category is not exists!', 400));
        return success(true);
    };

    /** @todo: save product */
    private hanleSaveProduct = async (entity: AccountRequest): Promise<Either<ProductModel, AppError>> => {
        /** handle get array link images */

        const images = await this.handleGetLinkImage(entity?.files);
        if (images.isFailure()) return failure(images.error);

        /** processing sizes */
        const sizes: Array<string> = [];
        entity?.body?.sizes.map((item: string) => {
            const _item = JSON.parse(item);
            sizes.push(_item?.size);
        });
        /** handle save product */
        const dataCreate = { ...entity?.body, sizes: sizes, images: images.data, accountId: entity?.account?.id };
        // const dataCreate = { ...entity?.body, sizes: sizes, accountId: entity?.account?.id };
        const response = await this.productRepo.create(dataCreate);
        const _init = new ProductModel();
        const result = _init.fromProductModel(response);

        return success(_.omit(result, 'category'));
    };

    /** @todo: processing images */
    private handleGetLinkImage = async (data?: KeyedObject): Promise<Either<Array<string>, AppError>> => {
        /** init  */
        const result: Array<string> = [];
        await Promise.all(
            data!.map(async (item: KeyedObject) => {
                let img = fs.readFileSync(item.path);
                const params: ParamsImageType = {
                    database64: 'data:image/png;base64,' + img.toString('base64'),
                    package: 'ProductImages',
                    publicId: uuidv4()
                };
                const response = await this.cloudinary.uploadImage(params);
                result.push(response?.url);
            })
        );
        return success(result);
    };

    /** @todo: handle save product size */
    private handleSaveProductSize = async (
        entity: AccountRequest,
        id?: string
    ): Promise<Either<ProductSizeModel[], AppError>> => {
        const productSize: Array<ProductSizeModel> = [];
        entity?.body?.sizes.map((item: string) => {
            const _item = JSON.parse(item);
            productSize.push({ ..._item, productId: id } as ProductSizeModel);
        });
        const resultSize = await this.productSizeRepo.insertMary(productSize);
        return success(resultSize);
    };
}
