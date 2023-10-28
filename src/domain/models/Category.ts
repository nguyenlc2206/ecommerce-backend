import { KeyedObject } from '@ecommerce-backend/src/shared/types';

/** @todo: define Category model reponse */
export class CategoryModel {
    id?: string;
    accountId?: string;
    image?: string;
    name?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    products: Array<any>;

    fromCategoryModelCreate(category: CategoryModel) {
        if (category?.isDeleted) {
            return {} as CategoryModel;
        }
        return {
            id: category?.id,
            image: category?.image,
            name: category?.name
        } as CategoryModel;
    }

    fromCategoryModelGetAll(category: CategoryModel[]) {
        let categories: CategoryModel[] = [];
        category?.map((item: CategoryModel) => {
            categories.push({
                id: item?.id,
                name: item?.name,
                image: item?.image,
                accountId: item?.accountId,
                isDeleted: item?.isDeleted
            } as CategoryModel);
        });

        return categories;
    }
}
