/** @todo: define product repositpty */
export interface ProductRepository<T> {
    create(entity: T): Promise<T>;
    update(id?: string, entity?: T): Promise<T>;
    getById(id?: string): Promise<T>;
    delete(id?: string): Promise<void>;
    getAll(): Promise<T[]>;
}
