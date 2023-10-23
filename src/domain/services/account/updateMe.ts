// * import libs
import 'reflect-metadata';
import { Container, Service } from 'typedi';
import * as _ from 'lodash';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { AccountRequest, KeyedObject, ParamsImageType } from '@ecommerce-backend/src/shared/types';

import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';
import { AccountRepository } from '@ecommerce-backend/src/domain/repositories/account';
import { AccountRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/account.impl';
import { CloudinaryMethods } from '@ecommerce-backend/src/shared/methods/cloudinary';
import { Cloudinary } from '@ecommerce-backend/src/shared/common/cloudinary';

// ==============================||  UPDATE ME ACCOUNT SERVICES IMPLEMENT ||============================== //

export interface UpdateAccountMeService<Entity> {
    execute(entity: Entity): Promise<Either<AccountModel, AppError>>;
}

@Service()
export class UpdateAccountMeServiceImpl<Entity extends AccountRequest> implements UpdateAccountMeService<Entity> {
    protected accountRepo: AccountRepository<AccountModel>;
    protected cloudinary: CloudinaryMethods<KeyedObject>;

    // * constructor
    constructor() {
        this.accountRepo = Container.get(AccountRepositoryImpl);
        this.cloudinary = Container.get(Cloudinary);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<AccountModel, AppError>> {
        /** handle update avatar */
        let _entity = {} as AccountModel;
        if (entity?.body?.avatar) {
            const resultAvatar = await this.handleUpdateAvatar(entity, entity?.account);
            if (resultAvatar.isFailure()) return failure(resultAvatar.error);
            _entity = resultAvatar.data;
        }

        /** handle update data */
        _.omit(entity?.body, ['avatar']);
        const reponse = await this.accountRepo.update(entity?.accountId, {
            ...entity?.body,
            ..._entity
        });
        const _init = new AccountModel();
        const result = _init.fromAccountModel(reponse);
        return success({ ...result, ...entity?.body, ..._entity });
    }

    /** handle update avatar */
    private handleUpdateAvatar = async (
        entity?: AccountRequest,
        account?: AccountModel
    ): Promise<Either<AccountModel, AppError>> => {
        const params: ParamsImageType = {
            database64: entity?.body?.avatar,
            package: 'AvatarImages',
            publicId: account?.email === entity?.body?.email ? account?.email : entity?.body?.email
        };

        const resImage = await this.handleGetLinkImage(params);
        if (resImage.isFailure()) return failure(resImage.error);
        const _entity = { avatar: resImage.data } as AccountModel;
        return success(_entity);
    };

    //* handle cloudinary iamge
    private handleGetLinkImage = async (params: ParamsImageType): Promise<Either<string, AppError>> => {
        const response = await this.cloudinary.uploadImage(params);
        return success(response?.url);
    };
}
