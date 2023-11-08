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

// ==============================||  CREATE PRODUCT CART SERVICES IMPLEMENT ||============================== //

export interface CreateProductCartService<Entity> {
    execute(entity: Entity): Promise<Either<ProductCartModel, AppError>>;
}

@Service()
export class CreateProductCartServiceImpl<Entity extends AccountRequest> implements CreateProductCartService<Entity> {
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
}
