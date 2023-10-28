// * import lib
import { Service } from 'typedi';

// * import projects
import { CouponRepository } from '@ecommerce-backend/src/domain/repositories/coupon';
import { CouponModel } from '@ecommerce-backend/src/domain/models/Coupon';
import CouponEntity from '@ecommerce-backend/src/infrastructure/schema/Coupon';

// ==============================||  COUPON REPOSITORY IMPLEMENT ||============================== //

@Service()
export class CouponRepositoryImpl<T extends CouponModel> implements CouponRepository<T> {
    /** constructor */
    constructor() {}

    /** overiding create method */
    async create(entity: T): Promise<T> {
        const result = await new CouponEntity(entity).save();
        return result as T;
    }

    /** overiding getById method */
    async getById(id: string): Promise<T> {
        const result = await CouponEntity.findById(id);
        return result as T;
    }

    /** overiding delete method */
    async delete(id: string): Promise<void> {
        const result = await CouponEntity.findById(id);
        if (result) {
            result.isDeleted = true;
            result.deletedAt = new Date(Date.now());
            await result.save();
        }
    }

    /** overiding getAll method */
    async getAll(): Promise<T[]> {
        const result = await CouponEntity.find();
        return result as T[];
    }

    /** overiding update method */
    async update(id: string, entity: T): Promise<T> {
        const result = await CouponEntity.findByIdAndUpdate(id, entity);
        return result as T;
    }

    /** overiding getByCode method */
    async getByCode(code: string, type: string, id: string): Promise<T> {
        const popObj = {
            path: 'accountId',
            select: 'id'
        };
        const result = await CouponEntity.findOne({ code: code, type: type, accountId: id }).populate(popObj);
        return result as T;
    }

    /** overiding get discount method */
    async getDiscountByCode(code: string): Promise<T> {
        const popObj = {
            path: 'accountId',
            select: 'id'
        };
        const result = await CouponEntity.findOne({ code: code }).populate(popObj);
        return result as T;
    }
}
