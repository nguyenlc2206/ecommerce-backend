"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCartModel = void 0;
/** @todo: define Product Cart model reponse */
class ProductCartModel {
    id;
    products;
    name;
    size;
    color;
    qty;
    accountId;
    status;
    billingAddress;
    paymentMethod;
    discounts;
    isDeleted;
    deletedAt;
    createdAt;
    updatedAt;
    productId;
    fromProductCartModel(productCartModel) {
        return {
            id: productCartModel?.id,
            status: productCartModel?.status,
            products: productCartModel?.products,
            discounts: productCartModel?.discounts,
            billingAddress: productCartModel?.billingAddress
        };
    }
    fromProductCartModelGetAll(productCartModel) {
        let products = [];
        productCartModel?.map((item) => {
            products.push({
                id: item?.id,
                status: item?.status,
                products: item?.products,
                discounts: item?.discounts,
                billingAddress: item?.billingAddress
            });
        });
        return products;
    }
}
exports.ProductCartModel = ProductCartModel;
