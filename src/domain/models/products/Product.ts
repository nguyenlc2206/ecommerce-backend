import { KeyedObject } from '@ecommerce-backend/src/shared/types';
import { CategoryModel } from '@ecommerce-backend/src/domain/models/Category';
import { ProductSizeModel } from '@ecommerce-backend/src/domain/models/products/Size';

/** @todo: define Product model reponse */
export class ProductModel {
    id?: string;
    name?: string;
    description?: string;
    categoryId?: CategoryModel;
    sizes?: Array<string>;
    colors?: Array<string>;
    accountId?: string;
    images?: Array<any>;
    reviews?: Array<string>;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
    category?: CategoryModel;
    products?: ProductSizeModel[];
    filter?: any;
    filterCategories?: any;
    filterProductSize?: any;
    totalQty?: number;

    fromProductModel(productModel: KeyedObject) {
        const _init = new ProductSizeModel();
        const _category = new CategoryModel();
        return {
            id: productModel?.id,
            name: productModel?.name,
            description: productModel?.description,
            sizes: productModel?.sizes,
            colors: productModel?.colors,
            images: productModel?.images,
            products: _init.fromProductModelGetAll(productModel?.ProductSize),
            category: _category.fromCategoryModel(productModel?.categoryId)
        } as ProductModel;
    }

    fromProductModelGetAll(productModel: ProductModel[]) {
        let products: ProductModel[] = [];
        const _init = new ProductSizeModel();
        const _category = new CategoryModel();

        productModel?.map((item: KeyedObject) => {
            products.push({
                id: item?.id,
                name: item?.name,
                sizes: item?.sizes,
                colors: item?.colors,
                description: item?.description,
                images: item?.images,
                products: _init.fromProductModelGetAll(item?.ProductSize),
                category: _category.fromCategoryModel(item?.categoryId),
                isDeleted: item?.isDeleted
            } as ProductModel);
        });

        return products;
    }

    fromProductModelQuery(productModel: ProductModel[]) {
        let products: ProductModel[] = [];
        const _init = new ProductSizeModel();
        productModel?.map((item: KeyedObject) => {
            if (!item?.isDeleted && item?.ProductSize.length) {
                products.push({
                    id: item?.id,
                    name: item?.name,
                    sizes: item?.sizes,
                    colors: item?.colors,
                    description: item?.description,
                    images: item?.images,
                    products: _init.fromProductModelGetAll(item?.ProductSize),
                    isDeleted: item?.isDeleted
                } as ProductModel);
            }
        });

        return products;
    }

    fromProductModelFilter(productModel: ProductModel[]) {
        let products: ProductModel[] = [];
        const _init = new ProductSizeModel();
        const _initCategory = new CategoryModel();
        productModel?.map((item: KeyedObject) => {
            if (!item?.isDeleted && item?.categoryId) {
                products.push({
                    id: item?.id,
                    name: item?.name,
                    description: item?.description,
                    images: item?.images,
                    category: _initCategory.fromCategoryModel(item?.categoryId),
                    products: _init.fromProductModelGetAll(item?.ProductSize),
                    isDeleted: item?.isDeleted
                } as ProductModel);
            }
        });

        return products;
    }
}
