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

// ==============================||  ACTIVE SERVICES IMPLEMENT ||============================== //

export interface ActiveAccountService<Entity> {
    execute(entity: Entity): Promise<Either<string, AppError>>;
}

@Service()
export class ActiveAccountServiceImpl<Entity extends AccountRequest> implements ActiveAccountService<Entity> {
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
        if (resultGet.data?.isDeleted) {
            const response = await this.accountRepo.update(entity?.params?.id, {
                isDeleted: false,
                deletedAt: null
            } as AccountModel);
        }
        return success('okie');
    }

    /** handle get account by id */
    private hanleGetAccount = async (id: string): Promise<Either<AccountModel | undefined, AppError>> => {
        const response = await this.accountRepo.getById(id);
        if (!response) return failure(new AppError('Not have account!', 400));
        return success(response);
    };
}
