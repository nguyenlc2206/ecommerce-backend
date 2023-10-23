/** @todo: define product size repositpty */
export interface ProductSizeRepository<T> {
    create(entity: T): Promise<T>;
    insertMary(entity: T[]): Promise<T[]>;
    getByProductIdAndSize(id?: string, size?: string): Promise<T[]>;
}
