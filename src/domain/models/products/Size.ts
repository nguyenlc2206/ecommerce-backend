import { KeyedObject } from '@ecommerce-backend/src/shared/types';
import { ProductModel } from '@ecommerce-backend/src/domain/models/products/Product';

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
    product?: ProductModel;

    fromProductModel(productModel: KeyedObject) {
        if (productModel?.isDeleted) {
            return {} as ProductSizeModel;
        }
        return {
            id: productModel?.id,
            size: productModel?.size,
            price: productModel?.price,
            totalQty: productModel?.totalQty,
            totalSold: productModel?.totalSold,
            isDeleted: productModel?.isDeleted
        } as ProductSizeModel;
    }

    fromProductModelGetAll(productModel: KeyedObject) {
        let products: ProductSizeModel[] = [];
        const _init = new ProductModel();
        productModel?.map((item: KeyedObject) => {
            if (!item?.isDeleted) {
                products.push({
                    id: item?.id,
                    size: item?.size,
                    price: item?.price,
                    totalQty: item?.totalQty,
                    totalSold: item?.totalSold,
                    product: _init.fromProductModel(item?.productId),
                    isDeleted: item?.isDeleted
                } as ProductSizeModel);
            }
        });
        return products;
    }
}
