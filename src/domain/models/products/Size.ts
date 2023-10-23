import { KeyedObject } from '@ecommerce-backend/src/shared/types';

/** @todo: define ProductSize model reponse */
export class ProductSizeModel {
    id?: string;
    productId?: string;
    size?: string;
    price?: number;
    totalQty?: number;
    totalSold?: number;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    fromProductModel(productModel: KeyedObject) {
        return {} as ProductSizeModel;
    }
}
