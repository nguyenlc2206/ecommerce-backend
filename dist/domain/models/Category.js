"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
/** @todo: define Category model reponse */
class CategoryModel {
    id;
    accountId;
    image;
    name;
    isDeleted;
    createdAt;
    updatedAt;
    deletedAt;
    products;
    fromCategoryModel(category) {
        return {
            id: category?.id,
            image: category?.image,
            name: category?.name
        };
    }
    fromCategoryModelGetAll(category) {
        let categories = [];
        category?.map((item) => {
            categories.push({
                id: item?.id,
                name: item?.name,
                image: item?.image,
                accountId: item?.accountId,
                isDeleted: item?.isDeleted
            });
        });
        return categories;
    }
}
exports.CategoryModel = CategoryModel;
