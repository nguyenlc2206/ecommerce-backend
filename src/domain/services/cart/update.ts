// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { ProductCartModel } from '@ecommerce-backend/src/domain/models/products/Cart';
import { AccountRequest, KeyedObject } from '@ecommerce-backend/src/shared/types';
import { ProductCartRepository } from '@ecommerce-backend/src/domain/repositories/products/cart';
import { ProductCartRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/cart.impl';
import { ProductRepository } from '@ecommerce-backend/src/domain/repositories/products/product';
import { ProductModel } from '@ecommerce-backend/src/domain/models/products/Product';
import { ProductRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/product.impl';
import { ProductSizeRepository } from '@ecommerce-backend/src/domain/repositories/products/size';
import { ProductSizeModel } from '@ecommerce-backend/src/domain/models/products/Size';
import { ProductSizeRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/size.impl';

// ==============================||  UPDATE PRODUCT CART SERVICES IMPLEMENT ||============================== //

export interface UpdateProductCardService<Entity> {
    execute(entity: Entity): Promise<Either<ProductCartModel, AppError>>;
}

@Service()
export class UpdateProductCardServiceImpl<Entity extends AccountRequest> implements UpdateProductCardService<Entity> {
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

        // check product item change
        if (entity?.body?.products) {
            const eleChanged = [
                ...this.handleGetEleChanged(entity?.body?.products, resultCheck?.data?.products!),
                ...this.handleGetEleChanged(resultCheck?.data?.products!, entity?.body?.products)
            ];

            const resultCheckProduct = await this.handleCheckProduct(eleChanged[0]?.productId!);
            if (resultCheckProduct.isFailure()) return failure(resultCheckProduct.error);

            // check product size
            const resultCheckSize = await this.handleCheckProductSize(eleChanged[0]?.id!);
            if (resultCheckSize.isFailure()) return failure(resultCheckSize.error);
        }

        // update cart
        let responseResult = {} as ProductCartModel;
        // check order complete
        if (entity?.body?.status === 'complete') {
            // order from payment to complete
            const resultUpdate = await this.handleUpdateCart(resultCheck.data?.id!, {
                ...entity?.body,
                products: [],
                discounts: [],
                status: 'initial'
            });
            if (resultUpdate.isFailure()) return failure(resultUpdate.error);
            responseResult = resultUpdate.data;

            // send email confirm order
        } else {
            const resultUpdate = await this.handleUpdateCart(resultCheck.data?.id!, entity?.body);
            if (resultUpdate.isFailure()) return failure(resultUpdate.error);
            responseResult = resultUpdate.data;
        }

        // processing data
        const _init = new ProductCartModel();
        const result = _init.fromProductCartModel(responseResult);
        return success(result);
    }

    /** @todo: check cart exists by acccountId */
    private handleCheckCart = async (id: string): Promise<Either<ProductCartModel, AppError>> => {
        const response = await this.productCartRepo.getCartByAccountId(id);
        if (!response) return failure(new AppError('Not have product in cart!', 400));
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

    /** @todo: update product cart */
    private handleUpdateCart = async (
        id: string,
        entity: ProductCartModel
    ): Promise<Either<ProductCartModel, AppError>> => {
        const response = await this.productCartRepo.update(id, entity);
        if (entity?.products) {
            // update products
            response.products = entity?.products;
        } else if (entity?.status && entity?.discounts) {
            // update discounts (update quantity)
            response.status = entity?.status;
            response.discounts = entity?.discounts;
        } else if (entity?.status && entity?.billingAddress) {
            // update billingAddress
            response.status = entity?.status;
            response.billingAddress = entity?.billingAddress;
        } else if (entity?.status && entity?.paymentMethod) {
            // update payment method
            response.status = entity?.status;
            response.paymentMethod = entity?.paymentMethod;
        }
        return success(response);
    };

    /** @todo: get ele change in array */
    private handleGetEleChanged = (arr1: Array<ProductCartModel>, arr2: Array<ProductCartModel>) => {
        return arr1.filter((object1) => !arr2.some((object2) => object1.qty === object2.qty));
    };
}
