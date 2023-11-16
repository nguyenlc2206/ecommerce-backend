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
import { OrderRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/order.impl';

import { ProductSizeModel } from '@ecommerce-backend/src/domain/models/products/Size';
import { ProductSizeRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/products/size.impl';
import { ProductSizeRepository } from '@ecommerce-backend/src/domain/repositories/products/size';
import { DiscountService, DiscountServiceImpl } from '@ecommerce-backend/src/domain/services/coupon/discount';
import { CouponModel } from '@ecommerce-backend/src/domain/models/Coupon';
import { CouponRepository } from '@ecommerce-backend/src/domain/repositories/coupon';

// import payment
import { PaymentStripeService, PaymentStripeServiceImpl } from '@ecommerce-backend/src/domain/services/payment/stripe';
import { CouponRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/coupon.impl';
import { Email } from '@ecommerce-backend/src/shared/common/email';

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
    protected couponRepo: CouponRepository<CouponModel>;

    /** init stripe payment */
    protected paymentStripe: PaymentStripeService<KeyedObject>;
    protected emailService: Email<KeyedObject>;

    /** constructor */
    constructor() {
        this.accountRepo = Container.get(AccountRepositoryImpl);
        this.orderRepo = Container.get(OrderRepositoryImpl);
        this.productSizeRepo = Container.get(ProductSizeRepositoryImpl);
        this.discountService = Container.get(DiscountServiceImpl);
        this.paymentStripe = Container.get(PaymentStripeServiceImpl);
        this.couponRepo = Container.get(CouponRepositoryImpl);
        this.emailService = Container.get(Email);
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
        const _init = new OrderModel();
        const result = _init.fromOrderModel(resultSave.data);

        // * handle send email confirm order
        const resultSendEmail = this.handleSendEmailConfirmOrder(entity, result);

        // * handle update product size
        const resultUpdate = this.handleUpdateProductSize(entity);

        // handle update coupon
        const resultCoupon = this.handleUpdateCodeCoupon(entity?.accountId!, coupon);

        // switch case processing payment
        switch (entity?.body?.paymentCharged?.method) {
            case 'card': {
                const resultStripe = await this.paymentStripe.execute(entity, resultSave.data?.id!, coupon);
                if (resultStripe.isFailure()) return failure(resultStripe.error);
                return success({ ...resultStripe.data, ...result });
            }
            default: {
                return success(result);
            }
        }
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

    /** @todo: processing code is use */
    private handleUpdateCodeCoupon = async (
        accountId: string,
        coupon: CouponModel
    ): Promise<Either<CouponModel | void, AppError>> => {
        const couponFinded = await this.couponRepo.getById(coupon?.id!);
        if (couponFinded?.type === 'personal') {
            const res = await this.couponRepo.delete(coupon?.id);
            return success(res);
        }
        const _arrayAccounts = couponFinded?.accountIdExpires;
        if (!_arrayAccounts?.includes(accountId)) _arrayAccounts?.push(accountId);
        const res = await this.couponRepo.update(coupon?.id, { accountIdExpires: _arrayAccounts } as CouponModel);
        return success(res);
    };

    /** hadnle send email confirm order */
    private handleSendEmailConfirmOrder = async (
        entity: AccountRequest,
        data: OrderModel
    ): Promise<Either<boolean, AppError>> => {
        const dataConfirm = {
            fullName: entity?.account?.fullName,
            email: entity?.account?.email,
            phoneNumber: entity?.account?.phoneNo,
            paymentType: data?.paymentCharged?.method,
            orderId: data?.orderNumber,
            orderDate: data?.createdAt,
            productItems: data?.orderItems,
            dicount: entity?.body?.discounts[0]?.value,
            note: 'Somthing from customer!'
        } as KeyedObject;
        const res = await this.emailService.sendEmailConfirmOrder(dataConfirm);
        return success(true);
    };
}
