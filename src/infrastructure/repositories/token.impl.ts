// * import lib
import { Service } from 'typedi';

// * import projects
import TokenEntity from '@ecommerce-backend/src/infrastructure/schema/Token';
import { TokenRepository } from '@ecommerce-backend/src/domain/repositories/token';
import { TokenModel } from '@ecommerce-backend/src/domain/models/Token';

// ==============================||  OTP REPOSITORY IMPLEMENT ||============================== //

@Service()
export class TokenRepositoryImpl<T extends TokenModel> implements TokenRepository<T> {
    // * constructor
    constructor() {}

    /** overiding create method */
    async create(entity: T): Promise<T> {
        const result = await new TokenEntity(entity).save();
        return result as T;
    }

    /** overding delete method */
    async delete(token?: string): Promise<void> {
        await TokenEntity.findOneAndDelete({ token: token });
    }

    /** overiding getByaccountId method */
    async getByaccountId(id: string, token: string): Promise<T> {
        const result = await TokenEntity.findOne({ accountId: id, token: token });
        return result as T;
    }
}
