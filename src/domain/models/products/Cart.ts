import { KeyedObject } from '@ecommerce-backend/src/shared/types';

/** @todo: define Product Cart model reponse */
export class ProductCartModel {
    id?: string;
    products?: KeyedObject;
    accountId?: string;
    status?: string;
    billingAddress?: KeyedObject;
    isDeleted?: boolean;
    deletedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;

    fromProductCartModel(productCartModel: ProductCartModel) {
        return {
            id: productCartModel?.id,
            status: productCartModel?.status,
            products: productCartModel?.products
        } as ProductCartModel;
    }

    fromProductCartModelGetAll(productCartModel: ProductCartModel[]) {
        let products: ProductCartModel[] = [];
        productCartModel?.map((item: KeyedObject) => {
            products.push({
                id: item?.id,
                status: item?.status,
                products: item?.products
            } as ProductCartModel);
        });
        return products;
    }
}
