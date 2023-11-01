// * import lib
import { Service, Container } from 'typedi';
import * as _ from 'lodash';
import Stripe from 'stripe';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';

import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';

import { AccountRequest, KeyedObject } from '@ecommerce-backend/src/shared/types';
import { AccountRepository } from '@ecommerce-backend/src/domain/repositories/account';
import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';
import { AccountRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/account.impl';

import { OrderModel } from '@ecommerce-backend/src/domain/models/Order';
import { OrderRepository } from '@ecommerce-backend/src/domain/repositories/order';
import { OrderRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/order';

import { ProductSizeModel } from '@ecommerce-backend/src/domain/models/products/Size';
import { ProductSizeRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/size.impl';
import { ProductSizeRepository } from '@ecommerce-backend/src/domain/repositories/products/size';
import ENV from '@ecommerce-backend/src/main/config/env';
import { DiscountService, DiscountServiceImpl } from '@ecommerce-backend/src/domain/services/coupon/discount';
import { CouponModel } from '@ecommerce-backend/src/domain/models/Coupon';

// ==============================||  CREATE ORDER SERVICES IMPLEMENT ||============================== //

export interface CreateOrderService<Entity> {
    execute(entity: Entity): Promise<Either<KeyedObject, AppError>>;
}

@Service()
export class CreateOrderServiceImpl<Entity extends AccountRequest> implements CreateOrderService<Entity> {
    /** init repo */
    protected accountRepo: AccountRepository<AccountModel>;
    protected orderRepo: OrderRepository<OrderModel>;
    protected productSizeRepo: ProductSizeRepository<ProductSizeModel>;
    protected discountService: DiscountService<AccountRequest>;

    //stripe instance
    protected stripe = new Stripe(ENV.stripeSecretKey);

    /** constructor */
    constructor() {
        this.accountRepo = Container.get(AccountRepositoryImpl);
        this.orderRepo = Container.get(OrderRepositoryImpl);
        this.productSizeRepo = Container.get(ProductSizeRepositoryImpl);
        this.discountService = Container.get(DiscountServiceImpl);
    }

    /** overiding execute */
    async execute(entity: Entity): Promise<Either<KeyedObject, AppError>> {
        // * handle get discount if have
        let coupon = {} as CouponModel;
        if (entity?.body?.codes) {
            const resultDiscount = await this.handleGetDiscount(entity);
            if (resultDiscount.isFailure()) return failure(resultDiscount.error);
            coupon = resultDiscount.data;
        }

        // * check has address
        const resultCheck = await this.handleCheckAddress(entity);
        if (resultCheck.isFailure()) return failure(resultCheck.error);

        // * handle get product
        const resultGet = await this.handleGetProduct(entity);
        if (resultGet.isFailure()) return failure(resultGet.error);

        // * handle save order
        const resultSave = await this.handleSaveOrder(entity?.accountId, entity?.body);
        if (resultSave.isFailure()) return failure(resultSave.error);

        // * handle update product size
        const resultUpdate = this.handleUpdateProductSize(entity);

        // * handle create session stripe
        const resultStripe = await this.handleCreateStripeSession(entity, resultSave.data?.id!, coupon);
        if (resultStripe.isFailure()) return failure(resultStripe.error);

        return success(resultStripe.data);
    }

    /** @todo: check has address */
    private handleCheckAddress = async (req: AccountRequest): Promise<Either<boolean, AppError>> => {
        const account = await this.accountRepo.getById(req?.accountId);
        if (!_.isEmpty(account?.shippingAddress)) {
            const dataAddress = { shippingAddress: req?.body?.shippingAddress } as AccountModel;
            await this.accountRepo.update(req?.accountId, dataAddress);
            return success(true);
        }
        return success(true);
    };

    /** @todo: get product with id and size */
    private handleGetProduct = async (req: AccountRequest): Promise<Either<string, AppError>> => {
        let error = null;
        await Promise.all(
            req?.body?.orderItems.map(async (data: ProductSizeModel) => {
                const product = await this.productSizeRepo.getByProductIdAndSize(data?.id, data?.size, data?.color);
                if (product.length === 0) {
                    error = failure(new AppError(`Product ${data?.name} is not exists!`, 400));
                    return;
                }
                if (Number(product[0].totalQty) < Number(data?.qty)) {
                    error = failure(new AppError(`Something wrong from qty with product name ${data?.name}!`, 400));
                    return;
                }
            })
        );
        if (error) return error;
        return success('okie');
    };

    /** @todo: save order to database */
    private handleSaveOrder = async (
        accountId?: string,
        entity?: OrderModel
    ): Promise<Either<OrderModel, AppError>> => {
        const dataCreate = {
            accountId: accountId,
            ...entity
        } as OrderModel;
        const response = await this.orderRepo.create(dataCreate);
        return success(response);
    };

    /** @todo: handle update product size */
    private handleUpdateProductSize = async (req: AccountRequest): Promise<Either<string, AppError>> => {
        let error = null;
        req?.body?.orderItems.map(async (data: ProductSizeModel) => {
            const product = await this.productSizeRepo.getByProductIdAndSize(data?.id, data?.size, data?.color);
            const dataUpdate = {
                totalQty: Number(product[0]?.totalQty) - Number(data?.qty),
                totalSold: Number(product[0]?.totalSold) + Number(data?.qty)
            } as ProductSizeModel;
            await this.productSizeRepo.update(product[0]?.id, dataUpdate);
        });
        if (error) return error;
        return success('okie');
    };

    /** @todo: handle get discount if have */
    private handleGetDiscount = async (req: AccountRequest): Promise<Either<CouponModel, AppError>> => {
        const discount = await this.discountService.execute(req);
        if (discount.isFailure()) return failure(discount.error);
        return success(discount.data);
    };

    /** @todo: handle convert orderItems to stripe need */
    private handleCreateStripeSession = async (
        req: AccountRequest,
        orderId: string,
        coupon: CouponModel
    ): Promise<Either<KeyedObject, AppError>> => {
        const convertedOrders = req?.body?.orderItems.map((item: KeyedObject) => {
            const _discount = item?.discount ? item?.discount : 0;
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item?.name,
                        description: item?.description
                    },
                    unit_amount:
                        _discount + coupon?.discount
                            ? item?.price * (1 - (_discount + coupon?.discount) / 100)
                            : item?.price
                },
                quantity: item?.qty
            };
        });

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: req?.email,
            line_items: convertedOrders,
            metadata: {
                orderId: JSON.stringify(orderId),
                accountId: JSON.stringify(req?.accountId),
                couponId: JSON.stringify(coupon?.id)
            },
            mode: 'payment',
            client_reference_id: orderId,
            success_url: 'http://localhost:8000/success',
            cancel_url: 'http://localhost:8000/cancel'
            // success_url: `${req.protocol}://${req.get('host')}/my-orders`,
            // cancel_url: 'http://localhost:3000/cancel'
        });

        return success({ url: session.url });
    };
}
