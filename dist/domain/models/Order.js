"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
/** @todo: define Order model reponse */
class OrderModel {
    id;
    accountId;
    orderItems;
    shippingAddress;
    orderNumber;
    paymentStatus;
    paymentMethod;
    totalPrice;
    currency;
    status;
    deliveredAt;
    isDeleted;
    createdAt;
    updatedAt;
    fromOrderModel(orderModel) {
        // if (orderModel?.isDeleted) {
        //     return {} as OrderModel;
        // }
        return {
            id: orderModel?.id,
            orderItems: orderModel?.orderItems,
            shippingAddress: orderModel?.shippingAddress,
            orderNumber: orderModel?.orderNumber,
            totalPrice: orderModel?.totalPrice,
            paymentStatus: orderModel?.paymentStatus,
            paymentMethod: orderModel?.paymentMethod,
            currency: orderModel?.currency,
            status: orderModel?.status,
            isDeleted: orderModel?.isDeleted
        };
    }
    fromOrderModelGetAll(orderModel) {
        let orders = [];
        orderModel?.map((item) => {
            orders.push({
                id: item?.id,
                orderItems: item?.orderItems,
                shippingAddress: item?.shippingAddress,
                orderNumber: item?.orderNumber,
                totalPrice: item?.totalPrice,
                paymentStatus: item?.paymentStatus,
                paymentMethod: item?.paymentMethod,
                currency: item?.currency,
                status: item?.status,
                isDeleted: item?.isDeleted
            });
        });
        return orders;
    }
}
exports.OrderModel = OrderModel;
