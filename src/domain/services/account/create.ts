// * import libs
import fs from 'fs';
import 'reflect-metadata';
import { Container, Service } from 'typedi';
import * as _ from 'lodash';

// * import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import ENV from '@ecommerce-backend/src/main/config/env';
import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';
import { AccountRepository } from '@ecommerce-backend/src/domain/repositories/account';
import { AccountRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/account.impl';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { BcryptAdapter } from '@ecommerce-backend/src/shared/common/bcrypt';
import { CloudinaryMethods } from '@ecommerce-backend/src/shared/methods/cloudinary';
import { AccountRequest, KeyedObject, ParamsImageType } from '@ecommerce-backend/src/shared/types';
import { Cloudinary } from '@ecommerce-backend/src/shared/common/cloudinary';

// ==============================||  CREATE ACCOUNT SERVICES IMPLEMENT ||============================== //

export interface CreateAccountService<Entity> {
    execute(entity: Entity): Promise<Either<AccountModel, AppError>>;
}

@Service()
export class CreateAccountServiceImpl<Entity extends AccountRequest> implements CreateAccountService<Entity> {
    protected accountRepo: AccountRepository<AccountModel>;
    protected cloudinary: CloudinaryMethods<KeyedObject>;

    // * constructor
    constructor() {
        this.accountRepo = Container.get(AccountRepositoryImpl);
        this.cloudinary = Container.get(Cloudinary);
    }

    /** overiding execute method */
    async execute(entity: Entity): Promise<Either<AccountModel, AppError>> {
        /** check email in database */
        const _checkEmail = await this.handleCheckEmail(entity?.body?.email);
        if (_checkEmail.isFailure()) return failure(_checkEmail.error);

        /** hash password */
        const _hashPassword = await this.handleHashPassword(entity?.body?.password);
        const _entity = { ...entity?.body, password: _hashPassword };
        let __entity = { ..._entity };

        /** handle cloudinary iamge */
        if (entity?.file) {
            let img = fs.readFileSync(entity.file.path);
            const params: ParamsImageType = {
                database64: 'data:image/png;base64,' + img.toString('base64'),
                package: 'AvatarImages',
                publicId: entity?.email
            };
            const resImage = await this.handleGetLinkImage(params);
            if (resImage.isFailure()) return failure(resImage.error);
            __entity = { ..._entity, avatar: resImage.data };
        } else {
            __entity = {
                ..._entity,
                avatar: 'https://res.cloudinary.com/dybi8swhy/image/upload/v1698151700/ImagesCommon/image-account-default.png'
            };
        }

        /** create account */
        const response = await this.accountRepo.create(__entity);
        const _init = new AccountModel();
        const result = _init.fromAccountModel(response);

        return success(result);
    }

    // * check email in database
    private handleCheckEmail = async (email?: string): Promise<Either<AccountModel | undefined, AppError>> => {
        const response = await this.accountRepo.getByEmail(email!);
        if (!response) return success(undefined);
        return failure(new AppError('Email is already!', 400));
    };

    // * hash password
    private handleHashPassword = async (password?: string): Promise<string> => {
        const { bcryptSalt } = ENV;
        const hasher = new BcryptAdapter(bcryptSalt);
        const hashedPassword = await hasher.hash(password!);
        return hashedPassword;
    };

    //* handle cloudinary iamge
    private handleGetLinkImage = async (params: ParamsImageType): Promise<Either<string, AppError>> => {
        const response = await this.cloudinary.uploadImage(params);
        return success(response?.url);
    };
}
