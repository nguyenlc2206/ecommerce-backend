// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import { Either, success } from '@ecommerce-backend/src/shared/common/either';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { CategoryModel } from '@ecommerce-backend/src/domain/models/Category';
import { CouponModel } from '@ecommerce-backend/src/domain/models/Coupon';
import { CouponRepository } from '@ecommerce-backend/src/domain/repositories/coupon';
import { CouponRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/coupon.impl';

// ==============================||  GET ALL SERVICES IMPLEMENT ||============================== //

export interface GetAllCouponService<Entity> {
    execute(): Promise<Either<CouponModel[], AppError>>;
}

@Service()
export class GetAllCouponServiceImpl<Entity extends CategoryModel> implements GetAllCouponService<Entity> {
    protected couponRepo: CouponRepository<CouponModel>;

    // * constructor
    constructor() {
        this.couponRepo = Container.get(CouponRepositoryImpl);
    }

    /** overiding execute method */
    async execute(): Promise<Either<CouponModel[], AppError>> {
        /** get all category by id */
        const response = await this.couponRepo.getAll();
        const _init = new CouponModel();
        const result = _init.fromCouponModelGetAll(response);
        return success(result as CouponModel[]);
    }
}
