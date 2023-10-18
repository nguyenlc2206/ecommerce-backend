// * import lib
import { Service } from 'typedi';

// * import projects
import OTPEntity from '@ecommerce-backend/src/infrastructure/schema/OTP';
import { OTPModel } from '@ecommerce-backend/src/domain/models/OTP';
import { OTPRepository } from '@ecommerce-backend/src/domain/repositories/otp';
// ==============================||  OTP REPOSITORY IMPLEMENT ||============================== //

@Service()
export class OTPRepositoryImpl<T extends OTPModel> implements OTPRepository<T> {
    // * constructor
    constructor() {}

    /** overiding create method */
    async create(entity: T): Promise<T> {
        const result = await new OTPEntity(entity).save();
        return result as T;
    }

    /** overding getByUserId method */
    async getByUserId(entity: T): Promise<T> {
        const result = await OTPEntity.findOne({ userId: entity?.userId, OTPType: entity?.OTPType });
        return result as T;
    }

    /** overiding update methods */
    async update(id: string, entity: T): Promise<T> {
        const result = await OTPEntity.findByIdAndUpdate(id, entity);
        return result as T;
    }
}
