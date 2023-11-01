// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { CouponModel } from '@ecommerce-backend/src/domain/models/Coupon';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { CouponRepository } from '@ecommerce-backend/src/domain/repositories/coupon';
import { CouponRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/coupon.impl';

// ==============================||  DISCOUNT SERVICES IMPLEMENT ||============================== //

export interface DiscountService<Entity> {
    execute(entity: Entity): Promise<Either<CouponModel, AppError>>;
}

@Service()
export class DiscountServiceImpl<Entity extends AccountRequest> implements DiscountService<Entity> {
    /** init service */
    protected couponRepo: CouponRepository<CouponModel>;

    /** constructor */
    constructor() {
        this.couponRepo = Container.get(CouponRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<CouponModel, AppError>> {
        /** handle get discount */
        const resultGet = await this.handleGetDiscount(entity);
        if (resultGet.isFailure()) return failure(resultGet.error);

        const _init = new CouponModel();
        const result = _init.fromCouponModelDiscount(resultGet.data);
        return success(result);
    }

    /** @todo: get discount */
    private handleGetDiscount = async (req: AccountRequest): Promise<Either<CouponModel, AppError>> => {
        const coupon = await this.couponRepo.getDiscountByCode(req?.body?.codes);
        // check code is used
        if (coupon.accountIdExpires?.includes(req?.accountId!)) return failure(new AppError('Code is used!', 400));

        const _init = new CouponModel();
        const result = _init.fromCouponModel(coupon);

        if (coupon?.type === 'personal' && result?.account?.id !== req?.accountId) {
            return failure(new AppError('Code is wrong!', 400));
        }

        return success(coupon);
    };
}
