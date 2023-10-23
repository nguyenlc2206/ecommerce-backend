// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';
import { AccountRepository } from '@ecommerce-backend/src/domain/repositories/account';
import { AccountRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/account.impl';
import { AccountRequest } from '@ecommerce-backend/src/shared/types';

// ==============================||  GET ACCOUNT SERVICES IMPLEMENT ||============================== //

export interface GetAccountMeService<Entity> {
    execute(entity: Entity): Promise<Either<AccountModel, AppError>>;
}

@Service()
export class GetAccountMeServiceImpl<Entity extends AccountRequest> implements GetAccountMeService<Entity> {
    protected accountRepo: AccountRepository<AccountModel>;

    // * constructor
    constructor() {
        this.accountRepo = Container.get(AccountRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<AccountModel, AppError>> {
        /** get account by id */
        const resultGet = await this.handleGetAccount(entity?.accountId);
        if (resultGet.isFailure()) return failure(resultGet.error);

        const _init = new AccountModel();
        const result = _init.fromAccountModel(resultGet.data as AccountModel);
        return success(result);
    }

    // * get accoount from database
    private handleGetAccount = async (id?: string): Promise<Either<AccountModel | undefined, AppError>> => {
        const response = await this.accountRepo.getById(id);
        if (!response) return failure(new AppError('Email is already!', 400));
        return success(response);
    };
}
