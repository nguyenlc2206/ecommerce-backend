// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import ENV from '@ecommerce-backend/src/main/config/env';

import { AccountRequest, DecodeAccountTokenType } from '@ecommerce-backend/src/shared/types';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { AccountRepository } from '@ecommerce-backend/src/domain/repositories/account';
import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';
import { AccountRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/account.impl';

import { TokenGeneratorAdapter } from '@ecommerce-backend/src/shared/common/jwt';
import { TokenRepository } from '@ecommerce-backend/src/domain/repositories/token';
import { TokenModel } from '@ecommerce-backend/src/domain/models/Token';
import { TokenRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/token.impl';

// ==============================||  PROTECT SERVICES IMPLEMENT ||============================== //

export interface ProtectedService<Entity> {
    execute(entity: Entity): Promise<Either<AccountModel, AppError>>;
}

@Service()
export class ProtectedServiceImpl<Entity extends AccountRequest> implements ProtectedService<Entity> {
    protected accountRepo: AccountRepository<AccountModel>;
    protected tokenRepo: TokenRepository<TokenModel>;

    // * constructor
    constructor() {
        this.accountRepo = Container.get(AccountRepositoryImpl);
        this.tokenRepo = Container.get(TokenRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<AccountModel, AppError>> {
        //* getting tokken and check of it's there
        const resultToken = this.handleGetTokenFromHeaders(entity);
        if (resultToken.isFailure()) return failure(resultToken.error);
        const { data: accessToken } = resultToken;

        //* Verification token
        const resultVerify = await this.handleVerifyToken(accessToken);
        if (resultVerify.isFailure()) return failure(resultVerify.error);
        const { key: _key, iat: _iat } = resultVerify.data;
        const keyParse = JSON.parse(JSON.stringify(_key));

        //* Check if account still exists by email
        const resultGet = await this.handleGetAccountById(keyParse?.id);
        if (resultGet.isFailure()) return failure(resultGet.error);
        // console.log('>>>Check result:', resultGet.data);

        //* Check email
        const isCheckEmail = this.handleCheckEmailChanged(keyParse?.email, resultGet.data?.email);
        if (!isCheckEmail) return failure(new AppError('User recently change email! Please login again.', 401));

        // * Get token from database
        const resultTokenGet = await this.handeGetToken(keyParse?.id, accessToken);
        if (resultTokenGet.isFailure()) return failure(resultTokenGet.error);

        //* Check if cusomter changed password after the token was issued
        const passwordChangedAt = resultGet.data?.passwordChangedAt;
        const resultChangedAt = this.handlePasswordChangedAfter(_iat, passwordChangedAt);
        if (resultChangedAt.isFailure()) return failure(resultChangedAt.error);

        // * processing account request
        return success({
            password: resultGet.data?.password,
            id: resultGet.data?.id,
            email: resultGet.data?.email,
            phoneNo: resultGet.data?.phoneNo,
            fullName: resultGet.data?.fullName,
            role: resultGet.data?.role,
            accessToken: accessToken
        } as AccountModel);
    }

    /** @todo: Getting tokken and check of it's there**/
    private handleGetTokenFromHeaders = (req: AccountRequest): Either<string, AppError> => {
        let accessToken;
        if (req.headers?.authorization && req.headers?.authorization.startsWith('Bearer')) {
            accessToken = req.headers?.authorization.split(' ')[1];
        }
        if (!accessToken) return failure(new AppError('You are not login. Please login to get access!', 401));
        return success(accessToken);
    };

    /** @todo: get token by userId and token form database */
    private handeGetToken = async (id?: string, token?: string): Promise<Either<TokenModel, AppError>> => {
        const response = await this.tokenRepo.getByUserId(id, token);
        if (!response) return failure(new AppError('Token is expires!', 401));
        return success(response);
    };

    /** @todo: Verification token **/
    private handleVerifyToken = async (token: string): Promise<Either<DecodeAccountTokenType, AppError>> => {
        const { jwtSecret, expiresIn } = ENV;
        const tokenGeneratorAdapter = new TokenGeneratorAdapter(jwtSecret, expiresIn);
        const decode = await tokenGeneratorAdapter.decrypt(token);
        return success(decode);
    };

    /** @todo: Check if account still exists by email **/
    private handleGetAccountById = async (id: string): Promise<Either<AccountModel, AppError>> => {
        const accountFinded = await this.accountRepo.getById(id);
        if (!accountFinded) return failure(new AppError('Email/Id is not exists in database!', 400));
        return success(accountFinded);
    };

    /** handle check email change */
    private handleCheckEmailChanged = (emailOld: string, emailNew?: string): boolean => {
        return emailOld === emailNew;
    };

    /** @todo: Check if customer changed password after the token was issued **/
    private handlePasswordChangedAfter = (timeDecode: number, passwordChangedAt?: Date): Either<boolean, AppError> => {
        const numberChangeAt = passwordChangedAt!.getTime();
        const changedTimestamp = parseInt((numberChangeAt / 1000).toString(), 10);
        if (timeDecode < changedTimestamp)
            return failure(new AppError('User recently change password! Please login again.', 401));
        return success(false);
    };
}
