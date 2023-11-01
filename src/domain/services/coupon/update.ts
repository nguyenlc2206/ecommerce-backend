// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';
import * as _ from 'lodash';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { CouponModel } from '@ecommerce-backend/src/domain/models/Coupon';
import { CouponRepository } from '@ecommerce-backend/src/domain/repositories/coupon';
import { CouponRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/coupon.impl';

// ==============================||  UPDATE COUPON SERVICES IMPLEMENT ||============================== //

export interface UpdateCouponService<Entity> {
    execute(entity: Entity): Promise<Either<CouponModel, AppError>>;
}

@Service()
export class UpdateCouponServiceImpl<Entity extends CouponModel> implements UpdateCouponService<Entity> {
    /** init service */
    protected couponRepo: CouponRepository<CouponModel>;

    constructor() {
        this.couponRepo = Container.get(CouponRepositoryImpl);
    }

    /** execute function */
    async execute(entity: Entity): Promise<Either<CouponModel, AppError>> {
        /** get category from database */
        const resultGet = await this.handleGetCoupon(entity?.id);
        if (resultGet.isFailure()) return failure(resultGet.error);
        const { data: coupon } = resultGet;
        const arrayAccountId = coupon?.accountIdExpires;
        arrayAccountId?.push(entity?.accountId!);

        /** handle update coupon */
        const resultUpdate = await this.handelUpdateCoupon(entity?.id, {
            accountIdExpires: arrayAccountId
        } as CouponModel);

        if (resultUpdate.isFailure()) return failure(resultUpdate.error);

        return success(resultUpdate.data);
    }

    // * get coupon from database
    private handleGetCoupon = async (id?: string): Promise<Either<CouponModel | undefined, AppError>> => {
        const response = await this.couponRepo.getById(id!);
        if (!response) return failure(new AppError('Coupon is not exists!', 400));
        return success(response);
    };

    /** @todo: handle update coupon to database */
    private handelUpdateCoupon = async (id?: string, entity?: CouponModel): Promise<Either<CouponModel, AppError>> => {
        const response = await this.couponRepo.update(id, entity);
        return success(response);
    };
}
