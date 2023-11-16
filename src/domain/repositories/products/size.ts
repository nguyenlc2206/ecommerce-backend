/** @todo: define product size repositpty */
export interface ProductSizeRepository<T> {
    create(entity: T): Promise<T>;
    insertMary(entity: T[]): Promise<T[]>;
    getByProductIdAndSize(id?: string, size?: string, color?: string): Promise<T[]>;
    update(id?: string, entity?: T): Promise<any>;
    getByProductId(id?: string): Promise<T[]>;
    find(entity: T): Promise<T[]>;
    getById(id: string): Promise<T>;
    sort(): Promise<T[]>;
}
