"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModel = void 0;
const Cart_1 = require("./products/Cart");
/** @todo: define account model reponse */
class AccountModel {
    id;
    fullName;
    phoneNo;
    avatar;
    email;
    password;
    role;
    createdAt;
    updatedAt;
    deletedAt;
    accessToken;
    passwordChangedAt;
    OTP;
    OTPType;
    isDeleted;
    categories;
    shippingAddress;
    file;
    cart;
    AccountProductCart;
    fromAccountModel(account) {
        const _init = new Cart_1.ProductCartModel();
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
        };
    }
    fromAccountModelLogin(account, token) {
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
        };
    }
    fromAccountModelGetAll(account) {
        let accounts = [];
        account?.map((item) => {
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
            });
        });
        return accounts;
    }
}
exports.AccountModel = AccountModel;
