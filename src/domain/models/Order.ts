import { KeyedObject } from '@ecommerce-backend/src/shared/types';
import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';

/** @todo: define Order model reponse */
export class OrderModel {
    id?: string;
    accountId?: AccountModel;
    orderItems?: Array<KeyedObject>;
    shippingAddress?: KeyedObject;
    paymentCharged?: KeyedObject;
    orderNumber?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    totalPrice?: any;
    currency?: string;
    status?: string;
    codes?: string;
    deliveredAt?: Date;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    account?: AccountModel;
    discounts?: KeyedObject;

    fromOrderModel(orderModel: KeyedObject) {
        const _account = new AccountModel();
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
            account: _account.fromAccountModel(orderModel?.accountId!),
            discounts: orderModel?.discounts,
            isDeleted: orderModel?.isDeleted,
            createdAt: orderModel?.createdAt
        } as OrderModel;
    }

    fromOrderModelGetAll(orderModel: OrderModel[]) {
        let orders: OrderModel[] = [];
        const _account = new AccountModel();
        orderModel?.map((item: OrderModel) => {
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
                account: _account.fromAccountModel(item?.accountId!),
                discounts: item?.discounts,
                isDeleted: item?.isDeleted
            } as OrderModel);
        });

        return orders;
    }
}
