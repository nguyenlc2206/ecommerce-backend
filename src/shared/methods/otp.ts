import { Either } from '@ecommerce-backend/src/shared/common/either';
import AppError from '@ecommerce-backend/src/shared/common/appError';

/** @todo: define OTP methods functions */
export interface OTPMethods<Entity> {
    generateOTP(): Promise<string>;
    createNewOTP(entity: Entity): Promise<string>;
    verifyOTP(entity: Entity): Promise<Either<boolean, AppError>>;
}
