"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCartModel = void 0;
/** @todo: define Product Cart model reponse */
class ProductCartModel {
    id;
    products;
    accountId;
    status;
    billingAddress;
    isDeleted;
    deletedAt;
    createdAt;
    updatedAt;
    fromProductCartModel(productCartModel) {
        return {
            id: productCartModel?.id,
            status: productCartModel?.status,
            products: productCartModel?.products
        };
    }
    fromProductCartModelGetAll(productCartModel) {
        let products = [];
        productCartModel?.map((item) => {
            products.push({
                id: item?.id,
                status: item?.status,
                products: item?.products
            });
        });
        return products;
    }
}
exports.ProductCartModel = ProductCartModel;
