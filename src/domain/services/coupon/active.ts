// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';

import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { CouponRepository } from '@ecommerce-backend/src/domain/repositories/coupon';
import { CouponModel } from '@ecommerce-backend/src/domain/models/Coupon';
import { CouponRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/coupon.impl';

// ==============================||  ACTIVE SERVICES IMPLEMENT ||============================== //

export interface ActiveCouponService<Entity> {
    execute(entity: Entity): Promise<Either<string, AppError>>;
}

@Service()
export class ActiveCouponServiceImpl<Entity extends AccountRequest> implements ActiveCouponService<Entity> {
    protected couponRepo: CouponRepository<CouponModel>;

    // * constructor
    constructor() {
        this.couponRepo = Container.get(CouponRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<string, AppError>> {
        /** handle get category by id */
        const resultGet = await this.hanleGetCoupon(entity?.params?.id);
        if (resultGet.isFailure()) return failure(resultGet.error);

        /** get all account by id */
        if (resultGet.data?.isDeleted) {
            const response = await this.couponRepo.update(entity?.params?.id, {
                isDeleted: false,
                deletedAt: null
            } as CouponModel);
        }
        return success('okie');
    }

    /** handle get coupon by id */
    private hanleGetCoupon = async (id: string): Promise<Either<CouponModel | undefined, AppError>> => {
        const response = await this.couponRepo.getById(id);
        if (!response) return failure(new AppError('Not have category!', 400));
        return success(response);
    };
}
