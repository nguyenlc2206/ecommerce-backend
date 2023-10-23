/** @todo: define category repository */
export interface CategoryRepository<T> {
    create(entity: T): Promise<T>;
    getByName(name: string): Promise<T>;
    getById(id: string): Promise<T>;
    update(id?: string, entity?: T): Promise<T>;
    delete(id?: string): Promise<void>;
    getAll(): Promise<T[]>;
}
