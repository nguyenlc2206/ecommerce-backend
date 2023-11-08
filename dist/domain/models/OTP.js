"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPModel = void 0;
/** @todo: define OTP model reponse */
class OTPModel {
    id;
    accountId;
    email;
    OTP;
    OTPCreatedTime;
    OTPAttempts;
    OTPRetry;
    isBlocked;
    blockUntil;
    OTPType;
    createdAt;
    updatedAt;
    fromOTPModelToChangePassword(OTPModel, email) {
        return {
            OTPAttempts: OTPModel?.OTPAttempts,
            isBlocked: OTPModel?.isBlocked,
            blockUntil: OTPModel?.blockUntil,
            email: email
        };
    }
}
exports.OTPModel = OTPModel;
