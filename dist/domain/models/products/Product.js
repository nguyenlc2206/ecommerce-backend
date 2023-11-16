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
    colors;
    accountId;
    images;
    reviews;
    isDeleted;
    createdAt;
    updatedAt;
    deletedAt;
    category;
    products;
    filter;
    filterCategories;
    filterProductSize;
    totalQty;
    fromProductModel(productModel) {
        const _init = new Size_1.ProductSizeModel();
        const _category = new Category_1.CategoryModel();
        return {
            id: productModel?.id,
            name: productModel?.name,
            description: productModel?.description,
            sizes: productModel?.sizes,
            colors: productModel?.colors,
            images: productModel?.images,
            products: _init.fromProductModelGetAll(productModel?.ProductSize),
            category: _category.fromCategoryModel(productModel?.categoryId)
        };
    }
    fromProductModelGetAll(productModel) {
        let products = [];
        const _init = new Size_1.ProductSizeModel();
        const _category = new Category_1.CategoryModel();
        productModel?.map((item) => {
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
            });
        });
        return products;
    }
    fromProductModelQuery(productModel) {
        let products = [];
        const _init = new Size_1.ProductSizeModel();
        productModel?.map((item) => {
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
