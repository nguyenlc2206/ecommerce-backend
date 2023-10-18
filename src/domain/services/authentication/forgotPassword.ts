// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import ENV from '@ecommerce-backend/src/main/config/env';

import { AccountRequest } from '@ecommerce-backend/src/shared/types';
import { Either, success } from '@ecommerce-backend/src/shared/common/either';

import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';
import { AccountRepository } from '@ecommerce-backend/src/domain/repositories/account';
import { AccountRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/account.impl';
import { BcryptAdapter } from '@ecommerce-backend/src/shared/common/bcrypt';

// ==============================||  FORGOT PASSWORD SERVICES IMPLEMENT ||============================== //

export interface ForgotPasswordService<Entity> {
    execute(entity: Entity, account: AccountModel): Promise<Either<AccountModel, AppError>>;
}

@Service()
export class ForgotPasswordServiceImpl<Entity extends AccountRequest> implements ForgotPasswordService<Entity> {
    /** init service and repo */
    protected accountRepo: AccountRepository<AccountModel>;

    // * constructor
    constructor() {
        this.accountRepo = Container.get(AccountRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity, account: AccountModel): Promise<Either<AccountModel, AppError>> {
        /** hash password */
        const _hashPassword = await this.handleHashPassword(entity?.body?.password);
        const _entity = { password: _hashPassword, passwordChangedAt: new Date(Date.now()) } as AccountModel;

        /** update account */
        const response = await this.accountRepo.update(account.id, _entity);
        const _init = new AccountModel();
        const result = _init.fromAccountModel(response);

        return success(result);
    }

    // * hash password
    private handleHashPassword = async (password?: string): Promise<string> => {
        const { bcryptSalt } = ENV;
        const hasher = new BcryptAdapter(bcryptSalt);
        const hashedPassword = await hasher.hash(password!);
        return hashedPassword;
    };
}
