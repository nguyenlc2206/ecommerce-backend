/** @todo: define OTP repositpty */
export interface OTPRepository<T> {
    create(entity: T): Promise<T>;
    getByUserId(entity: T): Promise<T>;
    update(id: string, entity: T): Promise<T>;
}
