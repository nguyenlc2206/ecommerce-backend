import { KeyedObject } from '@ecommerce-backend/src/shared/types';

/** @todo: define OTP model reponse */
export class OTPModel {
    id?: string;
    accountId?: string;
    email?: string;
    OTP?: string;
    OTPCreatedTime?: Date;
    OTPAttempts?: number;
    OTPRetry?: number;
    isBlocked?: boolean;
    blockUntil?: Date;
    OTPType?: string;
    createdAt?: Date;
    updatedAt?: Date;

    fromOTPModelToChangePassword(OTPModel: KeyedObject, email: string) {
        return {
            OTPAttempts: OTPModel?.OTPAttempts,
            isBlocked: OTPModel?.isBlocked,
            blockUntil: OTPModel?.blockUntil,
            email: email
        } as OTPModel;
    }
}
