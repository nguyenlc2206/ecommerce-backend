import { CategoryModel } from '@ecommerce-backend/src/domain/models/Category';
import { KeyedObject } from '@ecommerce-backend/src/shared/types';
import { ProductCartModel } from './products/Cart';

/** @todo: define account model reponse */
export class AccountModel {
    id?: string;
    fullName?: string;
    phoneNo?: string;
    avatar?: string;
    email?: string;
    password?: string;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
    accessToken?: string;
    passwordChangedAt?: Date;
    OTP?: string;
    OTPType?: string;
    isDeleted?: boolean;
    categories?: CategoryModel[];
    shippingAddress?: KeyedObject;
    file?: Express.Multer.File;
    cart?: ProductCartModel;
    AccountProductCart?: ProductCartModel[];

    fromAccountModel(account: AccountModel) {
        const _init = new ProductCartModel();
        return {
            id: account?.id,
            email: account?.email,
            fullName: account?.fullName,
            phoneNo: account?.phoneNo,
            avatar: account?.avatar,
            role: account?.role,
            isDeleted: account?.isDeleted,
            shippingAddress: account?.shippingAddress,
            cart: account?.AccountProductCart ? _init.fromProductCartModelGetAll(account?.AccountProductCart)[0] : []
        } as AccountModel;
    }

    fromAccountModelLogin(account?: AccountModel, token?: string) {
        return {
            id: account?.id,
            email: account?.email,
            fullName: account?.fullName,
            phoneNo: account?.phoneNo,
            role: account?.role,
            isDeleted: account?.isDeleted,
            avatar: account?.avatar,
            accessToken: token,
            shippingAddress: account?.shippingAddress
        } as AccountModel;
    }

    fromAccountModelGetAll(account?: AccountModel[]) {
        let accounts: AccountModel[] = [];
        account?.map((item: AccountModel) => {
            accounts.push({
                id: item?.id,
                email: item?.email,
                fullName: item?.fullName,
                phoneNo: item?.phoneNo,
                avatar: item?.avatar,
                role: item?.role,
                isDeleted: item?.isDeleted,
                categories: item?.categories,
                shippingAddress: item?.shippingAddress
            } as AccountModel);
        });
        return accounts as AccountModel[];
    }
}
