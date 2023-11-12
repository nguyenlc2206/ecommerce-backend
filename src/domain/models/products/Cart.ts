import { KeyedObject } from '@ecommerce-backend/src/shared/types';

/** @todo: define Product Cart model reponse */
export class ProductCartModel {
    id?: string;
    products?: ProductCartModel[];
    name?: string;
    size?: string;
    color?: string;
    qty?: string;
    accountId?: string;
    status?: string;
    billingAddress?: KeyedObject;
    paymentMethod?: KeyedObject;
    discounts?: number;
    isDeleted?: boolean;
    deletedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;

    fromProductCartModel(productCartModel: ProductCartModel) {
        return {
            id: productCartModel?.id,
            status: productCartModel?.status,
            products: productCartModel?.products,
            discounts: productCartModel?.discounts,
            billingAddress: productCartModel?.billingAddress
        } as ProductCartModel;
    }

    fromProductCartModelGetAll(productCartModel: ProductCartModel[]) {
        let products: ProductCartModel[] = [];
        productCartModel?.map((item: KeyedObject) => {
            products.push({
                id: item?.id,
                status: item?.status,
                products: item?.products,
                discounts: item?.discounts,
                billingAddress: item?.billingAddress
            } as ProductCartModel);
        });
        return products;
    }
}
