// * import libs
import 'reflect-metadata';
import * as _ from 'lodash';
import { Container, Service } from 'typedi';

// * import projects
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { ProductCartModel } from '@ecommerce-backend/src/domain/models/products/Cart';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { ProductCartRepository } from '@ecommerce-backend/src/domain/repositories/products/cart';
import { ProductCartRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/cart.impl';

// ==============================||  DELETE PRODUCT CART SERVICES IMPLEMENT ||============================== //

export interface DeleteProductCartService<Entity> {
    execute(entity: Entity): Promise<Either<ProductCartModel, AppError>>;
}

@Service()
export class DeleteProductCartServiceImpl<Entity extends AccountRequest> implements DeleteProductCartService<Entity> {
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

        // remove product cart
        const resultRemove = await this.handleRemoveProduct(entity.params?.id, resultCheck.data);
        if (resultRemove.isFailure()) return failure(resultRemove.error);

        return success({} as ProductCartModel);
    }

    /** @todo: check cart exists by acccountId */
    private handleCheckCart = async (id: string): Promise<Either<ProductCartModel, AppError>> => {
        const response = await this.productCartRepo.getCartByAccountId(id);
        if (!response) return failure(new AppError('Not have product in cart!', 400));
        return success(response);
    };

    /** @todo: delete product cart */
    private handleRemoveProduct = async (
        id: string,
        cart: ProductCartModel
    ): Promise<Either<ProductCartModel | void, AppError>> => {
        const products = _.cloneDeep(cart?.products) as Array<ProductCartModel>;
        // check id product
        const itemFinded = _.find(products, { id: id });
        if (!itemFinded) return failure(new AppError('Product is not exists!', 400));

        // check if product is empty
        _.remove(products, (product) => product.id === id);
        if (!products.length) {
            const res = await this.productCartRepo.delete(cart?.id);
        }

        const entity = { products: products };
        const res = await this.productCartRepo.update(cart?.id, entity as ProductCartModel);
        return success(res);
    };
}
