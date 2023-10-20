// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { KeyedObject } from '@ecommerce-backend/src/shared/types';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';

import { Email } from '@ecommerce-backend/src/shared/common/email';
import { OTPService } from '@ecommerce-backend/src/shared/common/otp';

import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';
import { AccountRepository } from '@ecommerce-backend/src/domain/repositories/account';
import { AccountRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/account.impl';

import { OTPRepository } from '@ecommerce-backend/src/domain/repositories/otp';
import { OTPModel } from '@ecommerce-backend/src/domain/models/OTP';
import { OTPRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/otp.impl';

// ==============================||  FORGOT PASSWORD SERVICES IMPLEMENT ||============================== //

export interface GenerateOTPService<Entity> {
    execute(entity: Entity): Promise<Either<OTPModel, AppError>>;
}

@Service()
export class GenerateOTPServiceImpl<Entity extends AccountModel> implements GenerateOTPService<Entity> {
    /** init service and repo */
    protected emailService: Email<KeyedObject>;
    protected OTPRepo: OTPRepository<OTPModel>;
    protected OTPService: OTPService<KeyedObject>;
    protected accountRepo: AccountRepository<AccountModel>;

    // * constructor
    constructor() {
        this.emailService = Container.get(Email);
        this.OTPService = Container.get(OTPService);
        this.OTPRepo = Container.get(OTPRepositoryImpl);
        this.accountRepo = Container.get(AccountRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<OTPModel, AppError>> {
        // * get account by email
        const resultGet = await this.handleGetAccountByEmail(entity?.email);
        if (resultGet.isFailure()) return failure(resultGet.error);
        const { data: account } = resultGet;

        // * get OTP by userId and typeOTP
        const resultGetOTP = await this.handleGetOTPInfo(account?.id, 'OTPForgotPassword');
        if (resultGetOTP.isFailure()) return failure(resultGetOTP.error);
        const { data: OTPInfo } = resultGetOTP;

        // * generate OTP
        const OTP = await this.OTPService.generateOTP();

        // * hash OTP
        const resultHash = await this.handleHashOTP(account?.phoneNo, OTP);
        // console.log('>>>Check resultHash:', resultHash);

        let resultOTP: Either<OTPModel, AppError>;
        if (!resultGetOTP.data) {
            // * handle save OTP to database
            resultOTP = await this.handleSaveOTP(account, resultHash);
            if (resultOTP.isFailure()) return failure(resultOTP.error);
        } else {
            // * handle update OTP to database
            resultOTP = await this.handleUpdateOTP(OTPInfo, resultHash);
            if (resultOTP.isFailure()) return failure(resultOTP.error);
        }

        // * proccesing result
        const _initOTPModel = new OTPModel();
        const result = _initOTPModel.fromOTPModelToChangePassword(resultOTP.data);

        //* send email
        if ((OTPInfo?.OTPRetry && OTPInfo?.OTPRetry > 0) || !resultGetOTP.data) {
            const resultSend = this.handleSendOTP(account, OTP);
            if (resultSend.isFailure()) return failure(resultSend.error);
        }

        return success(result);
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

        // If account OTP is blocked, return an error
        if (res?.isBlocked && res?.blockUntil) {
            const currentTime = new Date(Date.now());
            if (currentTime < res?.blockUntil) {
                return failure(new AppError('Account blocked. Try after some time.', 403));
            }
        }

        // Check for minimum 1-minute gap between OTP requests
        const lastOTPTime = res?.OTPCreatedTime!.getTime();
        const currentTime = new Date(Date.now()).getTime();

        if (lastOTPTime && currentTime - lastOTPTime < 60000) {
            return failure(new AppError('Minimum 1-minute gap required between OTP requests', 403));
        }
        return success(res);
    };

    /** @todo: generate OTP and send to customer */
    private handleSendOTP = (entity?: AccountModel, OTP?: string): Either<AccountModel, AppError> => {
        const _entity = { email: entity?.email, OTP: OTP };
        const res = this.emailService.sendEmailChangePassword(_entity);
        return success(entity!);
    };

    /** @todo: hash OTP to save database */
    private handleHashOTP = async (phone?: string, otp?: string): Promise<string> => {
        const entity: KeyedObject = {
            expiresAfter: 5,
            phone: phone,
            otp: otp,
            key: 'verysecret'
        };
        const hashOTP = await this.OTPService.createNewOTP(entity);
        return hashOTP;
    };

    /** handle save OTP to database */
    private handleSaveOTP = async (entity?: AccountModel, OTP?: string): Promise<Either<OTPModel, AppError>> => {
        const data = {
            userId: entity?.id,
            OTP: OTP,
            OTPCreatedTime: new Date(Date.now()),
            OTPType: 'OTPForgotPassword'
        } as OTPModel;
        const res = await this.OTPRepo.create(data);
        return success(res);
    };

    /** handle update OTP to database */
    private handleUpdateOTP = async (entity: OTPModel, OTP: string): Promise<Either<OTPModel, AppError>> => {
        const _id = entity?.id;
        let data = {} as OTPModel;
        // * check retry OTP times
        if (entity?.OTPRetry === 1) {
            const blockUntil = new Date(Date.now());
            blockUntil.setHours(blockUntil.getHours() + 1);
            data = {
                isBlocked: true,
                blockUntil: blockUntil,
                OTPRetry: entity?.OTPRetry - 1,
                OTP: OTP,
                OTPCreatedTime: new Date(Date.now())
            } as OTPModel;
        } else if (entity?.OTPRetry) {
            data = { OTPRetry: entity?.OTPRetry - 1, OTP: OTP, OTPCreatedTime: new Date(Date.now()) } as OTPModel;
        }
        const res = await this.OTPRepo.update(_id!, data);
        return success(res);
    };
}
