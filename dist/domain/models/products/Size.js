"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSizeModel = void 0;
const Product_1 = require("../../../domain/models/products/Product");
/** @todo: define ProductSize model reponse */
class ProductSizeModel {
    id;
    productId;
    name;
    size;
    price;
    discount;
    totalQty;
    totalSold;
    isDeleted;
    createdAt;
    updatedAt;
    product;
    qty;
    description;
    color;
    filter;
    populate;
    fromProductModel(productModel) {
        // if (productModel?.isDeleted) {
        //     return {} as ProductSizeModel;
        // }
        return {
            id: productModel?.id,
            size: productModel?.size,
            price: productModel?.price,
            totalQty: productModel?.totalQty,
            totalSold: productModel?.totalSold,
            isDeleted: productModel?.isDeleted
        };
    }
    fromProductModelGetAll(productModel) {
        let products = [];
        const _init = new Product_1.ProductModel();
        productModel?.map((item) => {
            products.push({
                id: item?.id ? item?.id : item?._id,
                size: item?.size,
                price: item?.price,
                discount: item?.discount,
                color: item?.color,
                totalQty: item?.totalQty,
                totalSold: item?.totalSold,
                isDeleted: item?.isDeleted,
                product: _init.fromProductModel(item?.productId)
            });
        });
        return products;
    }
    fromProductModelFilter(productModel) {
        let products = [];
        const _init = new Product_1.ProductModel();
        productModel?.map((item) => {
            if (item?.productId?.categoryId) {
                products.push({
                    id: item?.id,
                    size: item?.size,
                    price: item?.price,
                    discount: item?.discount,
                    color: item?.color,
                    totalQty: item?.totalQty,
                    totalSold: item?.totalSold,
                    product: _init.fromProductModel(item?.productId),
                    isDeleted: item?.isDeleted
                });
            }
        });
        return products;
    }
}
exports.ProductSizeModel = ProductSizeModel;
