/** @todo: define Token repositpty */
export interface TokenRepository<T> {
    create(entity: T): Promise<T>;
    delete(token?: string): Promise<void>;
    getByaccountId(id?: string, token?: string): Promise<T>;
}
