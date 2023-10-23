/** @todo: define product repositpty */
export interface ProductRepository<T> {
    create(entity: T): Promise<T>;
}
