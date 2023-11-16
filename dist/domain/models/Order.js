"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const Account_1 = require("../../domain/models/Account");
/** @todo: define Order model reponse */
class OrderModel {
    id;
    accountId;
    orderItems;
    shippingAddress;
    paymentCharged;
    orderNumber;
    paymentStatus;
    paymentMethod;
    totalPrice;
    currency;
    status;
    codes;
    deliveredAt;
    isDeleted;
    createdAt;
    updatedAt;
    account;
    discounts;
    fromOrderModel(orderModel) {
        const _account = new Account_1.AccountModel();
        return {
            id: orderModel?.id,
            orderItems: orderModel?.orderItems,
            shippingAddress: orderModel?.shippingAddress,
            paymentCharged: orderModel?.paymentCharged,
            orderNumber: orderModel?.orderNumber,
            totalPrice: orderModel?.totalPrice,
            paymentStatus: orderModel?.paymentStatus,
            paymentMethod: orderModel?.paymentMethod,
            currency: orderModel?.currency,
            status: orderModel?.status,
            account: _account.fromAccountModel(orderModel?.accountId),
            discounts: orderModel?.discounts,
            isDeleted: orderModel?.isDeleted,
            createdAt: orderModel?.createdAt
        };
    }
    fromOrderModelGetAll(orderModel) {
        let orders = [];
        const _account = new Account_1.AccountModel();
        orderModel?.map((item) => {
            orders.push({
                id: item?.id,
                orderItems: item?.orderItems,
                shippingAddress: item?.shippingAddress,
                paymentCharged: item?.paymentCharged,
                orderNumber: item?.orderNumber,
                totalPrice: item?.totalPrice,
                paymentStatus: item?.paymentStatus,
                paymentMethod: item?.paymentMethod,
                currency: item?.currency,
                status: item?.status,
                account: _account.fromAccountModel(item?.accountId),
                discounts: item?.discounts,
                isDeleted: item?.isDeleted
            });
        });
        return orders;
    }
}
exports.OrderModel = OrderModel;
