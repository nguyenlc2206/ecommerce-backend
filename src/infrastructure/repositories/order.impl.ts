// * import lib
import { Service } from 'typedi';

// * import projects
import { OrderModel } from '@ecommerce-backend/src/domain/models/Order';
import { OrderRepository } from '@ecommerce-backend/src/domain/repositories/order';
import OrderEntity from '@ecommerce-backend/src/infrastructure/schema/Order';

// ==============================||  ORDER REPOSITORY IMPLEMENT ||============================== //

@Service()
export class OrderRepositoryImpl<T extends OrderModel> implements OrderRepository<T> {
    /** constructor */
    constructor() {}

    /** overiding create method */
    async create(entity: T): Promise<T> {
        const result = await new OrderEntity(entity).save();
        return result as T;
    }

    /** overiding getById method */
    async getById(id: string): Promise<T> {
        const popObj = {
            path: 'accountId'
        };
        const result = await OrderEntity.findById(id).populate(popObj);
        return result as T;
    }

    /** overiding delete method */
    async delete(id: string): Promise<void> {
        const result = await OrderEntity.findById(id);
        if (result) {
            result.isDeleted = true;
            result.deletedAt = new Date(Date.now());
            await result.save();
        }
    }

    /** overiding getAll method */
    async getAll(): Promise<T[]> {
        const popObj = {
            path: 'accountId'
        };
        const result = await OrderEntity.find().populate(popObj);
        return result as T[];
    }

    /** overiding update method */
    async update(id: string, entity: T): Promise<T> {
        const result = await OrderEntity.findByIdAndUpdate(id, entity);
        return result as T;
    }

    /** overiding getTotal method */
    async getTotal(): Promise<number> {
        const total = await OrderEntity.countDocuments();
        return total;
    }

    /** overiding getPaginate method */
    async getPaginate(startIdx: number, limit: number): Promise<T[]> {
        const result = await OrderEntity.find().skip(startIdx).limit(limit);
        return result as T[];
    }

    /** overiding getByAccountId method */
    async getByAccountId(id: string): Promise<T[]> {
        const popObj = {
            path: 'accountId'
        };
        const result = await OrderEntity.find({ accountId: id }).populate(popObj);
        return result as T[];
    }
}
