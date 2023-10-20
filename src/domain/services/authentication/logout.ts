// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import { Either, success } from '@ecommerce-backend/src/shared/common/either';
import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { AccountRepository } from '@ecommerce-backend/src/domain/repositories/account';
import { TokenRepository } from '@ecommerce-backend/src/domain/repositories/token';
import { TokenModel } from '@ecommerce-backend/src/domain/models/Token';
import { AccountRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/account.impl';
import { TokenRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/token.impl';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';

// ==============================||  LOGOUT SERVICES IMPLEMENT ||============================== //

export interface LogoutService<Entity> {
    execute(entity: Entity): Promise<Either<AccountModel, AppError>>;
}

@Service()
export class LogoutServiceImpl<Entity extends AccountRequest> implements LogoutService<Entity> {
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
        await this.tokenRepo.delete(entity?.accessToken);
        return success({} as AccountModel);
    }
}
