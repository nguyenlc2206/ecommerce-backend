// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import { Either, success } from '@ecommerce-backend/src/shared/common/either';
import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { AccountRepository } from '@ecommerce-backend/src/domain/repositories/account';
import { AccountRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/account.impl';

// ==============================||  GET ALL SERVICES IMPLEMENT ||============================== //

export interface GetAllAccountService<Entity> {
    execute(): Promise<Either<AccountModel[], AppError>>;
}

@Service()
export class GetAllAccountServiceImpl<Entity extends AccountModel> implements GetAllAccountService<Entity> {
    protected accountRepo: AccountRepository<AccountModel>;

    // * constructor
    constructor() {
        this.accountRepo = Container.get(AccountRepositoryImpl);
    }

    /** overiding execute method */
    async execute(): Promise<Either<AccountModel[], AppError>> {
        /** get all account by id */
        const response = await this.accountRepo.getAll();
        const _init = new AccountModel();
        const result = _init.fromAccountModelGetAll(response);
        return success(result as AccountModel[]);
    }
}
