// * import libs
import 'reflect-metadata';
import { v4 as uuidv4 } from 'uuid';
import { Container, Service } from 'typedi';

// * import projects
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { ProductModel } from '@ecommerce-backend/src/domain/models/products/Product';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { AccountRequest, KeyedObject, ParamsImageType } from '@ecommerce-backend/src/shared/types';
import { ProductRepository } from '@ecommerce-backend/src/domain/repositories/products/product';
import { ProductSizeRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/size.impl';
import { ProductRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/product.impl';
import { Cloudinary } from '@ecommerce-backend/src/shared/common/cloudinary';
import { CloudinaryMethods } from '@ecommerce-backend/src/shared/methods/cloudinary';
import { ProductSizeModel } from '@ecommerce-backend/src/domain/models/products/Size';

// ==============================||  UPDATE PRODUCT SERVICES IMPLEMENT ||============================== //

export interface UpdateProductService<Entity> {
    execute(entity: Entity): Promise<Either<ProductModel, AppError>>;
}

@Service()
export class UpdateProductServiceImpl<Entity extends AccountRequest> implements UpdateProductService<Entity> {
    /** init services */
    protected cloudinary: CloudinaryMethods<KeyedObject>;
    protected productRepo: ProductRepository<ProductModel>;
    protected productSizeRepo: ProductSizeRepositoryImpl<ProductSizeModel>;

    constructor() {
        this.cloudinary = Container.get(Cloudinary);
        this.productRepo = Container.get(ProductRepositoryImpl);
        this.productSizeRepo = Container.get(ProductSizeRepositoryImpl);
    }

    /** execute function */
    async execute(entity: Entity): Promise<Either<ProductModel, AppError>> {
        /** handle get product */
        const resultGet = await this.handleGetProduct(entity?.params?.id);
        if (resultGet.isFailure()) return failure(resultGet.error);

        /** handle processing image */
        let images: Array<string> = [];
        if (entity?.body?.images) {
            /** handle get array link images */
            const resultImages = await this.handleGetLinkImage(entity?.body?.images, resultGet.data);
            if (resultImages.isFailure()) return failure(resultImages.error);
            images = resultImages.data;
        }

        /** handle update */
        const response = await this.productRepo.update(entity?.params?.id, { ...entity?.body, images: images });
        return success(response);
    }

    /** @todo: handle get product */
    private handleGetProduct = async (id?: string): Promise<Either<ProductModel, AppError>> => {
        const res = await this.productRepo.getById(id!);
        if (!res) return failure(new AppError('Product id is not exists!', 400));
        return success(res);
    };

    //* handle cloudinary iamge
    private handleGetLinkImage = async (
        data: KeyedObject,
        product: ProductModel
    ): Promise<Either<Array<string>, AppError>> => {
        /** init  */
        const result: Array<string> = [];
        await Promise.all(
            data.map(async (item: any) => {
                let params: ParamsImageType = {};
                if (item?.id) {
                    product.images?.map(async (url: string, index: number) => {
                        const lastItem = url.split('/').pop();
                        const publicId = lastItem?.split('.')[0];

                        if (item?.id === publicId) {
                            params = {
                                database64: item?.data,
                                package: 'ProductImages',
                                publicId: item?.id
                            };
                            const response = await this.cloudinary.uploadImage(params);
                            product.images![index] = response?.url;
                        }
                    });
                } else {
                    params = {
                        database64: item?.data,
                        package: 'ProductImages',
                        publicId: uuidv4()
                    };
                    const response = await this.cloudinary.uploadImage(params);
                    result.push(response?.url);
                }
            })
        );
        return success([...product.images!, ...result]);
    };
}
