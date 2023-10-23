import { KeyedObject } from '@ecommerce-backend/src/shared/types';

/** @todo: define Product model reponse */
export class ProductModel {
    id?: string;
    name?: string;
    description?: string;
    categoryId?: string;
    sizes?: Array<string>;
    accountId?: string;
    images?: Array<string>;
    reviews?: Array<string>;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    fromProductModel(productModel: KeyedObject) {
        return {} as ProductModel;
    }
}
