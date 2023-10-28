/** @todo: define coupon repository */
export interface CouponRepository<T> {
    create(entity: T): Promise<T>;
    getById(id: string): Promise<T>;
    delete(id?: string): Promise<void>;
    getAll(): Promise<T[]>;
    update(id?: string, entity?: T): Promise<T>;
    getByCode(code?: string, type?: string, id?: string): Promise<T>;
    getDiscountByCode(code?: string): Promise<T>;
}
