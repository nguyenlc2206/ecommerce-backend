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

// ==============================||  DELETE SERVICES IMPLEMENT ||============================== //

export interface DeleteAccountService<Entity> {
    execute(entity: Entity): Promise<Either<string, AppError>>;
}

@Service()
export class DeleteAccountServiceImpl<Entity extends AccountRequest> implements DeleteAccountService<Entity> {
    protected accountRepo: AccountRepository<AccountModel>;

    // * constructor
    constructor() {
        this.accountRepo = Container.get(AccountRepositoryImpl);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<string, AppError>> {
        /** handle get account by id */
        const resultGet = await this.hanleGetAccount(entity?.params?.id);
        if (resultGet.isFailure()) return failure(resultGet.error);

        /** get all account by id */
        const response = await this.accountRepo.delete(entity?.params?.id);
        return success('okie');
    }

    /** handle get account by id */
    private hanleGetAccount = async (id: string): Promise<Either<AccountModel | undefined, AppError>> => {
        const response = await this.accountRepo.getById(id);
        if (!response) return failure(new AppError('Note have account!', 400));
        return success(response);
    };
}
