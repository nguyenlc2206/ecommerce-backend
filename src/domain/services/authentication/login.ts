// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import ENV from '@ecommerce-backend/src/main/config/env';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';
import { AccountRepository } from '@ecommerce-backend/src/domain/repositories/account';
import { AccountRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/account.impl';
import { BcryptAdapter } from '@ecommerce-backend/src/shared/common/bcrypt';

import { TokenGeneratorAdapter } from '@ecommerce-backend/src/shared/common/jwt';
import { TokenRepository } from '@ecommerce-backend/src/domain/repositories/token';
import { TokenModel } from '@ecommerce-backend/src/domain/models/Token';
import { TokenRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/token.impl';

// ==============================||  LOGIN SERVICES IMPLEMENT ||============================== //

export interface LoginService<Entity> {
    execute(entity: Entity): Promise<Either<AccountModel, AppError>>;
}

@Service()
export class LoginServiceImpl<Entity extends AccountModel> implements LoginService<Entity> {
    /** init repo */
    protected accountRepo: AccountRepository<AccountModel>;
    protected tokenRepo: TokenRepository<TokenModel>;

    // * constructor
    constructor() {
        this.accountRepo = Container.get(AccountRepositoryImpl);
        this.tokenRepo = Container.get(TokenRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<AccountModel, AppError>> {
        /** get account by email */
        const account = await this.handleGetAccountByEmail(entity?.email);
        if (account.isFailure()) return failure(account.error);

        /** compare password */
        const hashPassword = account?.data?.password;
        const resultCompare = await this.handleComparePassword(entity?.password, hashPassword);
        if (resultCompare.isFailure()) return failure(resultCompare.error);
        if (!resultCompare.data) return failure(new AppError('Password is wrong!', 400));

        /** generate token by email and id */
        const resultToken = await this.handleGenerateToken(account.data);
        if (resultToken.isFailure()) return failure(resultToken.error);
        const { data: token } = resultToken;

        /** handle save token to database */
        const resultSave = await this.handleSaveToken(account.data, token);
        if (resultSave.isFailure()) return failure(resultSave.error);

        /** reponse result */
        const _init = new AccountModel();
        const result = _init.fromAccountModelLogin(account.data, token);

        return success(result);
    }

    /** get account by email */
    private handleGetAccountByEmail = async (email?: string): Promise<Either<AccountModel | undefined, AppError>> => {
        const response = await this.accountRepo.getByEmail(email!);
        if (!response) return failure(new AppError('Email is not exists!', 400));
        return success(response);
    };

    /** compare password */
    private handleComparePassword = async (
        passwordInformed?: string,
        hashPasswordUser?: string
    ): Promise<Either<boolean, AppError>> => {
        const { bcryptSalt } = ENV;
        const hasherAdapter = new BcryptAdapter(bcryptSalt);
        const result = await hasherAdapter.compare(passwordInformed!, hashPasswordUser!);
        return success(result);
    };

    /** generate token by email and id */
    private handleGenerateToken = async (account?: AccountModel): Promise<Either<string, AppError>> => {
        const { jwtSecret, expiresIn } = ENV;
        const tokenGeneratorAdapter = new TokenGeneratorAdapter(jwtSecret, expiresIn);
        const _key: any = { email: account!.email, id: account!.id };
        const token = await tokenGeneratorAdapter.generate(_key);
        return success(token);
    };

    /** hande save token to database */
    private handleSaveToken = async (account?: AccountModel, token?: string): Promise<Either<TokenModel, AppError>> => {
        const data = {
            accountId: account?.id,
            token: token,
            createdTime: new Date(Date.now())
        } as TokenModel;
        const response = await this.tokenRepo.create(data);
        return success(response);
    };
}
