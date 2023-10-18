// * import libs
import bcrypt from 'bcryptjs';

// ==============================|| BRYPY FUNCTIONS ||============================== //

export interface HashComparer {
    compare(password: string, hash: string): Promise<boolean>;
}

export interface Hasher {
    hash(password: string): Promise<string>;
}

export class BcryptAdapter implements Hasher, HashComparer {
    constructor(private readonly salt: number) {}

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.salt);
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
