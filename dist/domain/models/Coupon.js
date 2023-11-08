"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponModel = void 0;
/** @todo: define Coupon model reponse */
class CouponModel {
    id;
    code;
    startDate;
    endDate;
    discount;
    type;
    accountId;
    isDeleted;
    createdAt;
    updatedAt;
    account;
    accountIdExpires;
    fromCouponModel(couponModel) {
        return {
            id: couponModel?.id,
            code: couponModel?.code,
            startDate: couponModel?.startDate,
            endDate: couponModel?.endDate,
            discount: couponModel?.discount,
            account: couponModel?.accountId,
            type: couponModel?.type,
            isDeleted: couponModel?.isDeleted
        };
    }
    fromCouponModelDiscount(couponModel) {
        return {
            id: couponModel?.id,
            discount: couponModel?.discount
        };
    }
    fromCouponModelGetAll(couponModel) {
        let coupons = [];
        couponModel?.map((item) => {
            coupons.push({
                id: item?.id,
                code: item?.code,
                startDate: item?.startDate,
                endDate: item?.endDate,
                discount: item?.discount,
                account: item?.accountId,
                type: item?.type,
                isDeleted: item?.isDeleted
            });
        });
        return coupons;
    }
}
exports.CouponModel = CouponModel;
