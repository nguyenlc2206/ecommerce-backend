import { KeyedObject } from '@ecommerce-backend/src/shared/types';
import { CategoryModel } from '@ecommerce-backend/src/domain/models/Category';

/** @todo: define Product model reponse */
export class ProductModel {
    id?: string;
    name?: string;
    description?: string;
    categoryId?: CategoryModel;
    sizes?: Array<string>;
    accountId?: string;
    images?: Array<any>;
    reviews?: Array<string>;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    category?: CategoryModel;

    fromProductModel(productModel: KeyedObject) {
        if (productModel?.isDeleted) {
            return {} as ProductModel;
        }
        const _init = new CategoryModel();
        return {
            id: productModel?.id,
            name: productModel?.name,
            description: productModel?.description,
            sizes: productModel?.sizes,
            images: productModel?.images,
            category: _init.fromCategoryModelCreate(productModel?.categoryId)
        } as ProductModel;
    }

    fromProductModelGetAll(productModel: ProductModel[]) {
        let products: ProductModel[] = [];
        const _init = new CategoryModel();
        productModel?.map((item: KeyedObject) => {
            if (!item?.isDeleted) {
                products.push({
                    id: item?.id,
                    name: item?.name,
                    description: item?.description,
                    sizes: item?.images,
                    category: _init.fromCategoryModelCreate(item?.categoryId),
                    isDeleted: item?.isDeleted
                } as ProductModel);
            }
        });

        return products;
    }
}
