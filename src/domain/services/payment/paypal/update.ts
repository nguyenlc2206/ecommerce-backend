// import libs
import Container, { Service } from 'typedi';
import axios, { AxiosResponse } from 'axios';

// import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { AccountRequest, KeyedObject } from '@ecommerce-backend/src/shared/types';
import ENV from '@ecommerce-backend/src/main/config/env';
import { OrderModel } from '@ecommerce-backend/src/domain/models/Order';
import { OrderRepository } from '@ecommerce-backend/src/domain/repositories/order';
import { OrderRepositoryImpl } from '@ecommerce-backend/src/infrastructure/repositories/order.impl';

// ==============================||  PAYPAL PAYMENT CREATE ORDER SERVICES IMPLEMENT ||============================== //

export interface PaypalUpdateOrderService<Entity> {
    excute(entity: Entity): Promise<Either<KeyedObject, AppError>>;
}

@Service()
export class PaypalUpdateOrderServiceImpl<Entity extends AccountRequest> implements PaypalUpdateOrderService<Entity> {
    // init repo
    protected orderRepo: OrderRepository<OrderModel>;

    // constructor
    constructor() {
        this.orderRepo = Container.get(OrderRepositoryImpl);
    }

    // execute
    async excute(entity: Entity): Promise<Either<KeyedObject, AppError>> {
        // check paypal
        const resultPaypal = await this.handleCaptureOrder(entity?.query?.token as string);
        if (resultPaypal.isFailure()) return failure(resultPaypal.error);

        // update order database
        const resultUpdate = await this.handleUpdateOrderCollection(resultPaypal.data);
        if (resultUpdate.isFailure()) return failure(resultUpdate.error);

        console.log('>>>Check data:', resultPaypal.data);
        return success(resultPaypal.data?.status);
    }

    // handle capture order
    private handleCaptureOrder = async (orderId: string): Promise<Either<KeyedObject, AppError>> => {
        const response = await axios.post(
            `${ENV.paypalApi}/v2/checkout/orders/${orderId}/capture`,
            {},
            {
                auth: {
                    username: ENV.paypalclient,
                    password: ENV.paypalSecret
                }
            }
        );
        return success(response.data);
    };

    // handle update order database
    private handleUpdateOrderCollection = async (data: KeyedObject): Promise<Either<OrderModel, AppError>> => {
        if (data?.status === 'COMPLETED') {
            const orderId = data?.purchase_units[0]?.reference_id;
            const dataUpdate = {
                paymentStatus: 'paid',
                paymentMethod: 'paypal',
                currency: data?.purchase_units[0]?.payments?.captures[0]?.amount?.currency_code,
                totalPrice: Number(data?.purchase_units[0]?.payments?.captures[0]?.amount?.value)
            };
            const res = await this.orderRepo.update(orderId, dataUpdate as OrderModel);
            return success(res);
        }
        return success({} as OrderModel);
    };
}
