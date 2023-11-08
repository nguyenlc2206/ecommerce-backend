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

// ==============================||  GET PRODUCT CART SERVICES IMPLEMENT ||============================== //

export interface GetProductCartByAccountIdService<Entity> {
    execute(entity: Entity): Promise<Either<ProductCartModel, AppError>>;
}

@Service()
export class GetProductCartByAccountIdServiceImpl<Entity extends AccountRequest>
    implements GetProductCartByAccountIdService<Entity>
{
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

        const _init = new ProductCartModel();
        const result = _init.fromProductCartModel(resultCheck.data);
        return success(result);
    }

    /** @todo: check cart exists by acccountId */
    private handleCheckCart = async (id: string): Promise<Either<ProductCartModel, AppError>> => {
        const response = await this.productCartRepo.getCartByAccountId(id);
        if (!response) return failure(new AppError('Not have product in cart!', 400));
        return success(response);
    };
}
