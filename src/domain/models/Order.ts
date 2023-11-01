import { KeyedObject } from '@ecommerce-backend/src/shared/types';

/** @todo: define Order model reponse */
export class OrderModel {
    id?: string;
    accountId?: string;
    orderItems?: Array<KeyedObject>;
    shippingAddress?: KeyedObject;
    orderNumber?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    totalPrice?: any;
    currency?: string;
    status?: string;
    deliveredAt?: Date;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    fromOrderModel(orderModel: KeyedObject) {
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
        } as OrderModel;
    }

    fromOrderModelGetAll(orderModel: OrderModel[]) {
        let orders: OrderModel[] = [];
        orderModel?.map((item: OrderModel) => {
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
            } as OrderModel);
        });

        return orders;
    }
}
