// import lib
import Container, { Service } from 'typedi';

// import projects
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { ProductSizeModel } from '@ecommerce-backend/src/domain/models/products/Size';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { ProductRepository } from '@ecommerce-backend/src/domain/repositories/products/product';
import { ProductRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/product.impl';
import { ProductModel } from '@ecommerce-backend/src/domain/models/products/Product';
import { ProductSizeRepository } from '@ecommerce-backend/src/domain/repositories/products/size';
import { ProductSizeRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/size.impl';

// ==============================||  CREATE PRODUCT SERVICES IMPLEMENT ||============================== //

export interface CreateProductSizeService<Entity> {
    execute(entity: Entity): Promise<Either<ProductSizeModel, AppError>>;
}

@Service()
export class CreateProductSizeServiceImpl<Entity extends AccountRequest> implements CreateProductSizeService<Entity> {
    /** init service */
    protected productRepo: ProductRepository<ProductModel>;
    protected productSizeRepo: ProductSizeRepository<ProductSizeModel>;

    /** constructor */
    constructor() {
        this.productRepo = Container.get(ProductRepositoryImpl);
        this.productSizeRepo = Container.get(ProductSizeRepositoryImpl);
    }

    /** execute function */
    async execute(entity: Entity): Promise<Either<ProductSizeModel, AppError>> {
        /** handle get product with id */
        const resultGet = await this.hanleGetProduct(entity?.body?.productId);
        if (resultGet.isFailure()) return failure(resultGet.error);

        /** handle check type products */
        const resultCheckType = await this.handleCheckProductAdd(entity);
        if (resultCheckType.isFailure()) return failure(resultCheckType.error);

        /** create product size */
        const response = await this.productSizeRepo.create({ ...entity?.body });

        /** handleUpdate product */
        const resUpdate = await this.handleUpdateProduct(entity, resultGet.data!);
        if (resUpdate.isFailure()) return failure(resUpdate.error);

        return success(response);
    }

    /**@todo: handle get product with id */
    private hanleGetProduct = async (id: string): Promise<Either<ProductModel | undefined, AppError>> => {
        const response = await this.productRepo.getById(id);
        if (!response) return failure(new AppError('Not have product!', 400));
        return success(response);
    };

    /** @todo: handle check size and color is exist in database */
    private handleCheckProductAdd = async (entity: AccountRequest): Promise<Either<boolean, AppError>> => {
        const res = await this.productSizeRepo.find({
            filter: { productId: entity?.body?.productId, size: entity?.body?.size, color: entity?.body?.color }
        } as ProductSizeModel);
        if (res.length) return failure(new AppError('Product is exists in database!', 400));

        return success(true);
    };

    /** @todo: handle update product */
    private handleUpdateProduct = async (
        entity: AccountRequest,
        item: ProductModel
    ): Promise<Either<boolean, AppError>> => {
        let _colors: string[] = [...item?.colors!];
        let _sizes: string[] = [...item?.sizes!];
        if (!item.colors?.includes(entity?.body?.color)) _colors.push(entity?.body.color);
        if (!item.sizes?.includes(entity?.body?.color)) _sizes.push(entity?.body.size);
        const res = await this.productRepo.update(item?.id, { colors: _colors, sizes: _sizes } as ProductModel);
        return success(true);
    };
}
