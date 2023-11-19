// import libs
import { Service } from 'typedi';
import axios, { AxiosResponse } from 'axios';

// import projects
import AppError from '@ecommerce-backend/src/shared/common/appError';
import { Either, failure, success } from '@ecommerce-backend/src/shared/common/either';
import { KeyedObject } from '@ecommerce-backend/src/shared/types';
import ENV from '@ecommerce-backend/src/main/config/env';

// ==============================||  PAYPAL PAYMENT CREATE ORDER SERVICES IMPLEMENT ||============================== //

export interface PaypalCreateOrderService<Entity> {
    excute(entity: Entity, orderId: string): Promise<Either<KeyedObject, AppError>>;
}

@Service()
export class PaypalCreateOrderServiceImpl<Entity extends KeyedObject> implements PaypalCreateOrderService<Entity> {
    // constructor
    constructor() {}

    // execute
    async excute(entity: Entity, orderId: string): Promise<Either<KeyedObject, AppError>> {
        // convert order items
        const dataConvert = this.handleConvertOrderItems(entity?.body?.orderItems, entity?.body?.discounts);

        // create order paypal
        const response = await this.handleCreateOrderPaypal(dataConvert, orderId);
        if (response.isFailure()) return failure(response.error);

        // get link payment
        const resultGet = this.handleGetLinkPayment(response.data);
        if (resultGet.isFailure()) return failure(resultGet.error);

        return success({ url: resultGet.data });
    }

    // handle convert order items
    private handleConvertOrderItems = (orderItems: KeyedObject, discounts: KeyedObject) => {
        const items = orderItems.map((ele: KeyedObject) => {
            const _discount = ele?.discount ? ele?.discount : 0;
            const discountPrice = ele?.price * ((discounts[0]?.value || 0) / 100);
            return {
                name: ele?.name,
                quantity: ele?.qty.toString(),
                unit_amount: {
                    currency_code: 'USD',
                    value: (ele?.price * (1 - _discount / 100) - discountPrice).toFixed(2).toString()
                }
            };
        });

        let value: number = 0;
        items.map((ele: KeyedObject, index: number) => {
            value = value + Number(ele?.unit_amount?.value) * orderItems[index]?.qty;
        });
        const amount = {
            currency_code: 'USD',
            value: value.toFixed(2).toString(),
            breakdown: {
                item_total: {
                    currency_code: 'USD',
                    value: value.toFixed(2).toString()
                }
            }
        };
        // console.log('>>>Check:', items, amount);
        return { items: items, amount: amount };
    };

    // handle create order paypal
    private handleCreateOrderPaypal = async (
        dataConvert: KeyedObject,
        orderId: string
    ): Promise<Either<AxiosResponse, AppError>> => {
        const { items, amount } = dataConvert;
        const order = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    reference_id: orderId,
                    items: items,
                    amount: amount
                }
            ],
            payment_source: {
                paypal: {
                    experience_context: {
                        payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
                        brand_name: 'mailtrapservice.club',
                        user_action: 'PAY_NOW',
                        return_url: `${ENV.host}/api/v1/payment-paypal/success`,
                        cancel_url: `${ENV.host}/api/v1/payment-paypal/fail`
                    },
                    attributes: {}
                }
            }
        };

        // format the body
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');

        // Generate an access token
        const {
            data: { access_token }
        } = await axios.post(`${ENV.paypalApi}/v1/oauth2/token`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username: ENV.paypalclient,
                password: ENV.paypalSecret
            }
        });

        // make a request
        const response = await axios.post(`${ENV.paypalApi}/v2/checkout/orders`, order, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        return success(response.data as AxiosResponse);
    };

    // get link payment
    private handleGetLinkPayment = (data: KeyedObject): Either<string, AppError> => {
        const items = data?.links.filter((ele: KeyedObject) => ele?.rel === 'payer-action');
        return success(items[0]?.href as string);
    };
}
