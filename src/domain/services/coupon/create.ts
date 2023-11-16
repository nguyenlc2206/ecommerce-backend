// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';

import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { CouponModel } from '@ecommerce-backend/src/domain/models/Coupon';
import { CouponRepository } from '@ecommerce-backend/src/domain/repositories/coupon';
import { AccountRepository } from '@ecommerce-backend/src/domain/repositories/account';
import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';
import { CouponRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/coupon.impl';
import { AccountRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/account.impl';

// ==============================||  CREATE COUPON SERVICES IMPLEMENT ||============================== //

export interface CreateCouponService<Entity> {
    execute(entity: Entity): Promise<Either<CouponModel, AppError>>;
}

@Service()
export class CreateCouponServiceImpl<Entity extends AccountRequest> implements CreateCouponService<Entity> {
    /** init service */
    protected couponRepo: CouponRepository<CouponModel>;
    protected accountRepo: AccountRepository<AccountModel>;

    /** constructor */
    constructor() {
        this.couponRepo = Container.get(CouponRepositoryImpl);
        this.accountRepo = Container.get(AccountRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<CouponModel, AppError>> {
        /** init variables */
        const init = new CouponModel();
        let resultCheck: any;

        /** check account */
        if (entity?.body?.accountId) {
            /** handle check code coupon */
            resultCheck = await this.handleGetCoupon(entity?.body?.code, 'personal', entity?.body?.accountId);
            if (resultCheck.isFailure()) return failure(resultCheck.error);

            const account = await this.handleGetAccount(entity?.body?.accountId);
            if (account.isFailure()) return failure(account.error);
        } else {
            /** handle check code coupon */
            resultCheck = await this.handleGetCoupon(entity?.body?.code, 'all');
            if (resultCheck.isFailure()) return failure(resultCheck.error);
        }

        /** handle save coupon */
        const resultSave = await this.handleSaveCoupon(entity, init.fromCouponModel(resultCheck.data));
        if (resultSave.isFailure()) return failure(resultSave.error);

        const result = init.fromCouponModel(resultSave.data);
        return success(result);
    }

    /** @todo: handle get account by id */
    private handleGetAccount = async (id: string): Promise<Either<AccountModel | undefined, AppError>> => {
        const response = await this.accountRepo.getById(id);
        if (!response) return failure(new AppError('Note have account!', 400));
        return success(response);
    };

    /** @todo: handle get coupon by code */
    private handleGetCoupon = async (
        code?: string,
        type?: string,
        id?: string
    ): Promise<Either<CouponModel, AppError>> => {
        const response = await this.couponRepo.getByCode(code, type, id);
        if (response && response?.type === 'all') return failure(new AppError('Coupon code is exists!', 400));
        return success(response);
    };

    /** @todo: handle save coupon */
    private handleSaveCoupon = async (
        entity: AccountRequest,
        coupon: CouponModel
    ): Promise<Either<CouponModel, AppError>> => {
        let dataCreate = { ...entity?.body } as CouponModel;
        // * check account
        if (entity?.body?.accountId) {
            dataCreate.type = 'personal';

            if (coupon?.account?.id === entity?.body?.accountId)
                return failure(new AppError('Something wrong from accountId!', 400));
        }
        // * check time
        if (
            new Date(entity?.body?.startDate) > new Date(entity?.body?.endDate) ||
            new Date(entity?.body?.startDate) < new Date(Date.now()) ||
            new Date(entity?.body?.endDate) < new Date(Date.now())
        ) {
            return failure(new AppError('Something wrong from date!', 400));
        }
        /** save coupon */
        const result = await this.couponRepo.create(dataCreate);
        return success(result);
    };
}
