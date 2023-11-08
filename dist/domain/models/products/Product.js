"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const Category_1 = require("../../../domain/models/Category");
const Size_1 = require("../../../domain/models/products/Size");
/** @todo: define Product model reponse */
class ProductModel {
    id;
    name;
    description;
    categoryId;
    sizes;
    accountId;
    images;
    reviews;
    isDeleted;
    createdAt;
    updatedAt;
    category;
    products;
    filter;
    filterCategories;
    filterProductSize;
    fromProductModel(productModel) {
        const _init = new Category_1.CategoryModel();
        return {
            id: productModel?.id,
            name: productModel?.name,
            description: productModel?.description,
            sizes: productModel?.sizes,
            images: productModel?.images,
            category: _init.fromCategoryModel(productModel?.categoryId)
        };
    }
    fromProductModelGetAll(productModel) {
        let products = [];
        const _init = new Size_1.ProductSizeModel();
        productModel?.map((item) => {
            if (!item?.isDeleted) {
                products.push({
                    id: item?.id,
                    name: item?.name,
                    description: item?.description,
                    images: item?.images,
                    products: _init.fromProductModelGetAll(item?.ProductSize),
                    isDeleted: item?.isDeleted
                });
            }
        });
        return products;
    }
    fromProductModelFilter(productModel) {
        let products = [];
        const _init = new Size_1.ProductSizeModel();
        const _initCategory = new Category_1.CategoryModel();
        productModel?.map((item) => {
            if (!item?.isDeleted && item?.categoryId) {
                products.push({
                    id: item?.id,
                    name: item?.name,
                    description: item?.description,
                    images: item?.images,
                    category: _initCategory.fromCategoryModel(item?.categoryId),
                    products: _init.fromProductModelGetAll(item?.ProductSize),
                    isDeleted: item?.isDeleted
                });
            }
        });
        return products;
    }
}
exports.ProductModel = ProductModel;
