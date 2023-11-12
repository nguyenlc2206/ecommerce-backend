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

// ==============================||  UPDATE PRODUCT CART SERVICES IMPLEMENT ||============================== //

export interface UpdateProductCardService<Entity> {
    execute(entity: Entity): Promise<Either<ProductCartModel, AppError>>;
}

@Service()
export class UpdateProductCardServiceImpl<Entity extends AccountRequest> implements UpdateProductCardService<Entity> {
    // inii repo
    protected productCartRepo: ProductCartRepository<ProductCartModel>;
    // constructor
    constructor() {
        this.productCartRepo = Container.get(ProductCartRepositoryImpl);
    }

    // execute
    async execute(entity: Entity): Promise<Either<ProductCartModel, AppError>> {
        // check cart
        const resultCheck = await this.handleCheckCart(entity?.accountId!);
        if (resultCheck.isFailure()) return failure(resultCheck.error);
        // update cart
        let responseResult = {} as ProductCartModel;
        // check order complete
        if (entity?.body?.status === 'complete') {
            const resultUpdate = await this.handleUpdateCart(resultCheck.data?.id!, {
                ...entity?.body,
                products: [],
                discounts: [],
                status: 'initial'
            });
            if (resultUpdate.isFailure()) return failure(resultUpdate.error);
            responseResult = resultUpdate.data;
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

    /** @todo: update product cart */
    private handleUpdateCart = async (
        id: string,
        entity: ProductCartModel
    ): Promise<Either<ProductCartModel, AppError>> => {
        const response = await this.productCartRepo.update(id, entity);
        if (entity?.products) {
            response.products = entity?.products;
        } else if (entity?.status && entity?.discounts) {
            response.status = entity?.status;
            response.discounts = entity?.discounts;
        } else if (entity?.status && entity?.billingAddress) {
            response.status = entity?.status;
            response.billingAddress = entity?.billingAddress;
        } else if (entity?.status && entity?.paymentMethod) {
            response.status = entity?.status;
            response.paymentMethod = entity?.paymentMethod;
        }
        return success(response);
    };
}
