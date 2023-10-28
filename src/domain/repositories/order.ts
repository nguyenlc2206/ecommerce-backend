/** @todo: define order repository */
export interface OrderRepository<T> {
    create(entity: T): Promise<T>;
    getById(id: string): Promise<T>;
    delete(id?: string): Promise<void>;
    getAll(): Promise<T[]>;
    update(id?: string, entity?: T): Promise<T>;
    getTotal(): Promise<number>;
    getPaginate(startIdx: number, limit: number): Promise<T[]>;
}
