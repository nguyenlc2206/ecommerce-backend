// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { ProductCartModel } from '@ecommerce-backend/src/domain/models/products/Cart';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { ProductCartRepository } from '@ecommerce-backend/src/domain/repositories/products/cart';
import { ProductCartRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/cart.impl';
import { ProductRepository } from '@ecommerce-backend/src/domain/repositories/products/product';
import { ProductModel } from '@ecommerce-backend/src/domain/models/products/Product';
import { ProductRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/product.impl';
import { ProductSizeRepository } from '@ecommerce-backend/src/domain/repositories/products/size';
import { ProductSizeModel } from '@ecommerce-backend/src/domain/models/products/Size';
import { ProductSizeRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/size.impl';

// ==============================||  CREATE PRODUCT CART SERVICES IMPLEMENT ||============================== //

export interface CreateProductCartService<Entity> {
    execute(entity: Entity): Promise<Either<ProductCartModel, AppError>>;
}

@Service()
export class CreateProductCartServiceImpl<Entity extends AccountRequest> implements CreateProductCartService<Entity> {
    // inii repo
    protected productCartRepo: ProductCartRepository<ProductCartModel>;
    protected productRepo: ProductRepository<ProductModel>;
    protected productSizeRepo: ProductSizeRepository<ProductSizeModel>;
    // constructor
    constructor() {
        this.productCartRepo = Container.get(ProductCartRepositoryImpl);
        this.productRepo = Container.get(ProductRepositoryImpl);
        this.productSizeRepo = Container.get(ProductSizeRepositoryImpl);
    }

    // execute
    async execute(entity: Entity): Promise<Either<ProductCartModel, AppError>> {
        // check cart
        const resultCheck = await this.handleCheckCart(entity?.accountId!);
        if (resultCheck.isFailure()) return failure(resultCheck.error);

        // check product
        const resultCheckProduct = await this.handleCheckProduct(entity?.body?.products?.productId);
        if (resultCheckProduct.isFailure()) return failure(resultCheckProduct.error);

        // check product size
        const resultCheckSize = await this.handleCheckProductSize(entity?.body?.products?.id);
        if (resultCheckSize.isFailure()) return failure(resultCheckSize.error);

        const _init = new ProductCartModel();
        let result = {} as ProductCartModel;
        const data = new ProductCartModel();

        if (!resultCheck.data) {
            // execute if not cart with account id
            data.accountId = entity?.accountId;
            data.products = entity?.body?.products;
            const response = await this.productCartRepo.create(data);
            result = _init.fromProductCartModel(response);
        } else {
            // execute if cart exists
            const products = resultCheck.data?.products;
            products!.push(entity?.body?.products);
            data.products = products;
            data.status = 'initial';
            const response = await this.productCartRepo.update(resultCheck.data?.id, data);
            result = _init.fromProductCartModel(response);
            result.products = products;
        }
        return success(result);
    }

    /** @todo: check cart exists by acccountId */
    private handleCheckCart = async (id: string): Promise<Either<ProductCartModel, AppError>> => {
        const response = await this.productCartRepo.getCartByAccountId(id);
        return success(response);
    };

    /** @todo: handle check product is active */
    private handleCheckProduct = async (id: string): Promise<Either<boolean, AppError>> => {
        const response = await this.productRepo.getById(id);
        if (!response || response?.isDeleted) return failure(new AppError('Product is out of stock!', 400));
        return success(true);
    };

    /** @todo: check product in size */
    private handleCheckProductSize = async (id: string): Promise<Either<boolean, AppError>> => {
        const response = await this.productSizeRepo.getById(id);
        if (!response || response.isDeleted) return failure(new AppError('Product is not active!', 400));
        return success(true);
    };
}
