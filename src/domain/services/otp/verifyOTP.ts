// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import { AccountRequest, KeyedObject } from '@ecommerce-backend/src/shared/types';
import { OTPModel } from '@ecommerce-backend/src/domain/models/OTP';

import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import AppError from '@ecommerce-backend/src/shared/common/appError';

import { OTPRepository } from '@ecommerce-backend/src/domain/repositories/otp';

import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';
import { AccountRepository } from '@ecommerce-backend/src/domain/repositories/account';
import { AccountRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/account.impl';

import { OTPService } from '@ecommerce-backend/src/shared/common/otp';
import { OTPRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/otp.impl';
import { ForgotPasswordService, ForgotPasswordServiceImpl } from '../authentication/forgotPassword';

// ==============================|| VERIFY OTP SERVICES IMPLEMENT ||============================== //

export interface VerifyOTPService<Entity> {
    execute(entity: Entity): Promise<Either<OTPModel, AppError>>;
}

@Service()
export class VerifyOTPServiceImpl<Entity extends AccountRequest> implements VerifyOTPService<Entity> {
    /** init repo */
    protected OTPRepo: OTPRepository<OTPModel>;
    protected accountRepo: AccountRepository<AccountModel>;
    /** init services */
    protected OTPService: OTPService<KeyedObject>;
    protected forgotPasswordService: ForgotPasswordService<AccountRequest>;

    // * constructor
    constructor() {
        this.OTPService = Container.get(OTPService);
        this.OTPRepo = Container.get(OTPRepositoryImpl);
        this.accountRepo = Container.get(AccountRepositoryImpl);
        this.forgotPasswordService = Container.get(ForgotPasswordServiceImpl);
    }

    /** define otp type functions */
    OTPReducer = (type: string, req?: AccountRequest, account?: AccountModel) => {
        switch (type) {
            case 'OTPForgotPassword': {
                if (account) this.forgotPasswordService.execute(req!, account);
                break;
            }
            default: {
                break;
            }
        }
    };

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<OTPModel, AppError>> {
        // * get account by email
        const resultGet = await this.handleGetAccountByEmail(entity?.body?.email);
        if (resultGet.isFailure()) return failure(resultGet.error);
        const { data: account } = resultGet;

        // * get OTP by userId and typeOTP
        const resultGetOTP = await this.handleGetOTPInfo(account?.id, entity?.body?.OTPType);
        if (resultGetOTP.isFailure()) return failure(resultGetOTP.error);
        const { data: OTPInfo } = resultGetOTP;

        // * handle verify OTP
        const resultVerify = await this.handleVerifyOTP(account?.phoneNo, entity?.body?.OTP, OTPInfo?.OTP);
        if (resultVerify.isFailure()) return failure(resultVerify.error);

        if (resultVerify.data) {
            /** processing with relative actions */
            this.OTPReducer(entity?.body?.OTPType, entity, account);
            const resultUpdate = await this.handleUpdateOTP(OTPInfo);
            /** reset retry generate OTP */
            if (resultUpdate.isFailure()) return failure(resultUpdate.error);
        }

        return success(OTPInfo);
    }

    /** @todo: get account by email */
    private handleGetAccountByEmail = async (email?: string): Promise<Either<AccountModel | undefined, AppError>> => {
        const response = await this.accountRepo.getByEmail(email!);
        if (!response) return failure(new AppError('Email is not exists!', 400));
        return success(response);
    };

    /** @todo: get OTP by userId and typeOTP */
    private handleGetOTPInfo = async (userId?: string, OTPType?: string): Promise<Either<OTPModel, AppError>> => {
        const crities = { userId: userId, OTPType: OTPType } as OTPModel;
        const res = await this.OTPRepo.getByUserId(crities);
        return success(res);
    };

    /** @todo: handle verify OTP */
    private handleVerifyOTP = async (
        phone?: string,
        otp?: string,
        hash?: string
    ): Promise<Either<boolean, AppError>> => {
        const entity: KeyedObject = {
            phone: phone,
            otp: otp,
            hash: hash,
            key: 'verysecret'
        };
        const hashOTP = await this.OTPService.verifyOTP(entity);
        return hashOTP;
    };

    /** handle update OTP to database */
    private handleUpdateOTP = async (entity: OTPModel): Promise<Either<OTPModel, AppError>> => {
        const _id = entity?.id;
        const data = { isBlocked: false, OTPRetry: 2, OTPCreatedTime: new Date(Date.now()) } as OTPModel;
        const res = await this.OTPRepo.update(_id!, data);
        return success(res);
    };
}
