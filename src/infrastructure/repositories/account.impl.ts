// * import lib
import { Service } from 'typedi';

// * import projects
import AccountEntity from '@ecommerce-backend/src/infrastructure/schema/Account';
import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';
import { AccountRepository } from '@ecommerce-backend/src/domain/repositories/account';

// ==============================||  ACCOUNT REPOSITORY IMPLEMENT ||============================== //

@Service()
export class AccountRepositoryImpl<T extends AccountModel> implements AccountRepository<T> {
    // * constructor
    constructor() {}

    /** overiding create methods */
    async create(entity: T): Promise<T> {
        const result = await new AccountEntity(entity).save();
        return result as T;
    }

    /** overiding getByEmail methods */
    async getByEmail(email: string): Promise<T> {
        const result = await AccountEntity.findOne({ email }).select('+password');
        return result as T;
    }

    /** overiding update methods */
    async update(id: string, entity: T): Promise<T> {
        const result = await AccountEntity.findByIdAndUpdate(id, entity);
        return result as T;
    }

    /** overiding getById method */
    async getById(id: string): Promise<T> {
        const result = await AccountEntity.findById(id).select('+password');
        return result as T;
    }

    /** overiding getAll method */
    async getAll(): Promise<T[]> {
        const result = await AccountEntity.find({});
        return result as T[];
    }

    /** overiding delete method */
    async delete(id: string): Promise<void> {
        const result = await AccountEntity.findById(id);
        if (result) {
            result.isDeleted = true;
            result.deletedAt = new Date(Date.now());
            await result.save();
        }
    }
}
