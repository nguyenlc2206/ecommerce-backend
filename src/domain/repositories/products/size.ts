/** @todo: define product size repositpty */
export interface ProductSizeRepository<T> {
    create(entity: T): Promise<T>;
}
