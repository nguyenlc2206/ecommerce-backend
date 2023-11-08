/** @todo: define product cart repositpty */
export interface ProductCartRepository<T> {
    create(entity: T): Promise<T>;
    update(id?: string, entity?: T): Promise<any>;
    find(entity: T): Promise<T[]>;
    getCartByAccountId(id: string): Promise<T>;
}
