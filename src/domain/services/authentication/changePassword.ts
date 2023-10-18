// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import ENV from '@ecommerce-backend/src/main/config/env';
import { BcryptAdapter } from '@ecommerce-backend/src/shared/common/bcrypt';

import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { AccountRepository } from '@ecommerce-backend/src/domain/repositories/account';
import { AccountRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/account.impl';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';

// ==============================||  CHANGE PASSWORD SERVICES IMPLEMENT ||============================== //

export interface ChangePasswordService<Entity> {
    execute(entity: Entity): Promise<Either<AccountModel, AppError>>;
}

@Service()
export class ChangePasswordServiceImpl<Entity extends AccountRequest> implements ChangePasswordService<Entity> {
    protected accountRepo: AccountRepository<AccountModel>;

    // * constructor
    constructor() {
        this.accountRepo = Container.get(AccountRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<AccountModel, AppError>> {
        // * check current password is correct
        const resultCheck = await this.handleCheckPasswordCorrect(
            entity?.body.passwordCurrent,
            entity?.account?.password
        );
        if (resultCheck.isFailure()) return failure(resultCheck.error);
        if (!resultCheck.data) return failure(new AppError('Current password is invalid!', 400));

        // * hash new password
        const resultHashPassword = await this.handleHashPassword(entity?.body?.password);
        if (resultHashPassword.isFailure()) return failure(resultHashPassword.error);
        const { data: hashPassword } = resultHashPassword;

        // * change password
        const resultChanged = await this.handleChangePassword(entity, hashPassword);
        if (resultChanged.isFailure()) return failure(resultChanged.error);

        return success(resultChanged.data);
    }

    /** @todo: check current password is correct */
    private handleCheckPasswordCorrect = async (
        passwordInformed: string,
        hashPasswordUser?: string
    ): Promise<Either<boolean, AppError>> => {
        const { bcryptSalt } = ENV;
        const hasherAdapter = new BcryptAdapter(bcryptSalt);
        const result = await hasherAdapter.compare(passwordInformed, hashPasswordUser!);
        return success(result);
    };

    /** @todo: hash new password */
    private handleHashPassword = async (password: string): Promise<Either<string, AppError>> => {
        const { bcryptSalt } = ENV;
        const hasher = new BcryptAdapter(bcryptSalt);
        const hashedPassword = await hasher.hash(password);
        return success(hashedPassword);
    };

    /** @todo: change password */
    private handleChangePassword = async (
        req?: AccountRequest,
        hashPassword?: string
    ): Promise<Either<AccountModel, AppError>> => {
        const _id = req?.userId;
        const _itemUpdate = {
            password: hashPassword,
            passwordChangedAt: new Date(Date.now())
        } as AccountModel;
        const itemUpdate = await this.accountRepo.update(_id!, _itemUpdate);
        return success(itemUpdate);
    };
}
