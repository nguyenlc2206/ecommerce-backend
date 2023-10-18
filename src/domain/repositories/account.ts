/** @todo: define account repositpty */
export interface AccountRepository<T> {
    create(entity: T): Promise<T>;
    getByEmail(email: string): Promise<T>;
    update(id?: string, entity?: T): Promise<T>;
    getById(id?: string): Promise<T>;
    getAll(): Promise<T[]>;
    delete(id?: string): Promise<void>;
}
