import { KeyedObject } from '@ecommerce-backend/src/shared/types';
import { AccountModel } from '@ecommerce-backend/src/domain/models/Account';

/** @todo: define Coupon model reponse */
export class CouponModel {
    id?: string;
    code?: string;
    startDate?: Date;
    endDate?: Date;
    discount?: Number;
    type?: string;
    accountId?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    account?: AccountModel;
    accountIdExpires?: Array<string>;

    fromCouponModel(couponModel: KeyedObject) {
        return {
            id: couponModel?.id,
            code: couponModel?.code,
            startDate: couponModel?.startDate,
            endDate: couponModel?.endDate,
            discount: couponModel?.discount,
            account: couponModel?.accountId,
            type: couponModel?.type,
            isDeleted: couponModel?.isDeleted
        } as CouponModel;
    }

    fromCouponModelDiscount(couponModel: KeyedObject) {
        return {
            id: couponModel?.id,
            discount: couponModel?.discount,
            code: couponModel?.code
        } as CouponModel;
    }

    fromCouponModelGetAll(couponModel: CouponModel[]) {
        let coupons: CouponModel[] = [];
        couponModel?.map((item: CouponModel) => {
            coupons.push({
                id: item?.id,
                code: item?.code,
                startDate: item?.startDate,
                endDate: item?.endDate,
                discount: item?.discount,
                account: item?.accountId,
                type: item?.type,
                isDeleted: item?.isDeleted
            } as CouponModel);
        });

        return coupons;
    }
}
