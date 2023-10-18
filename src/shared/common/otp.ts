// * import libs
import { Service } from 'typedi';
import crypto from 'crypto';

// * import projects
import { KeyedObject } from '@ecommerce-backend/src/shared/types';
import { OTPMethods } from '@ecommerce-backend/src/shared/methods/otp';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import AppError from '@ecommerce-backend/src/shared/common/appError';

@Service()
export class OTPService<Entity extends KeyedObject> implements OTPMethods<Entity> {
    // * constructor
    constructor() {}

    /** overiding generateOTP method */
    async generateOTP(): Promise<string> {
        const hex = crypto.randomBytes(3).toString('hex');
        const OTP = parseInt(hex, 16).toString().substr(0, 6);
        return OTP;
    }

    /** overiding createOTP method */
    async createNewOTP(entity: Entity, algorithm: string = 'sha256'): Promise<string> {
        // console.log('>>>Check createNewOTP entity:', entity);
        const ttl = entity?.expiresAfter * 60 * 1000; //Expires after in Minutes, converteed to miliseconds
        const expires = Date.now() + ttl; //timestamp to 5 minutes in the future
        const data = `${entity?.phone}.${entity?.otp}.${expires}`; // phone.otp.expiry_timestamp
        const hashBase = crypto
            .createHmac(algorithm, entity?.key)
            .update(data)
            .digest('hex'); // creating SHA256 hash of the data
        const hash = `${hashBase}.${expires}`; // Hash.expires, format to send to the user
        return hash;
    }

    /** overiding verifyOTP method */
    async verifyOTP(entity: Entity, algorithm: string = 'sha256'): Promise<Either<boolean, AppError>> {
        // console.log('>>>Check verifyOTP entity:', entity);
        if (!entity?.hash.match('.')) return failure(new AppError('Something wrong from OTP!', 400)); // Hash should have at least one dot
        // Seperate Hash value and expires from the hash returned from the user(
        const [hashValue, expires] = entity?.hash.split('.');
        // Check if expiry time has passed
        const now = Date.now();
        if (now > expires) return failure(new AppError('OTP is expired!', 400));
        // Calculate new hash with the same key and the same algorithm
        const data = `${entity?.phone}.${entity?.otp}.${expires}`;
        const newCalculatedHash = crypto
            .createHmac(algorithm, entity?.key)
            .update(data)
            .digest('hex');
        // Match the hashes
        if (newCalculatedHash === hashValue) {
            return success(true);
        }
        return failure(new AppError('OTP is wrong!', 400));
    }
}
