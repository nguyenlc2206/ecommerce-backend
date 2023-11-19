// * import libs
import { Service } from 'typedi';
import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

// * import projects
import ENV from '@ecommerce-backend/src/main/config/env';
import { KeyedObject } from '@ecommerce-backend/src/shared/types';
import { EmailMethods } from '@ecommerce-backend/src/shared/methods/email';
import { formatDate } from '@ecommerce-backend/src/shared/common/format';
import { ProductSizeModel } from '@ecommerce-backend/src/domain/models/products/Size';

@Service()
export class Email<T extends KeyedObject> implements EmailMethods<T> {
    /** constructor */
    constructor() {}

    /** create new transport */
    createNewTransport() {
        return createTransport({
            host: ENV.emailHost,
            port: ENV.emailPort,
            auth: {
                user: ENV.emailUsername,
                pass: ENV.emailPassword
            }
        });
    }

    /** overding sendEmailChangePassword method */
    async sendEmailChangePassword(entity: T): Promise<SMTPTransport.SentMessageInfo> {
        const template = fs.readFileSync(`${process.cwd()}/src/shared/templates/html/sendOTP.html`, 'utf8');
        const compiledTemplate = handlebars.compile(template);
        const html = compiledTemplate(entity);

        const info = await this.createNewTransport().sendMail({
            from: `"Ecommerce 👻" <ecommerce.app@example.com>`, // sender address
            to: `${entity?.email}`, // list of receivers
            subject: 'OTP FOR CHANGE PASSWORD ✔', // Subject line
            html: `${html}` // html body
        });
        return info;
    }

    /** overding sendEmailSupport method */
    async sendEmailSupport(entity: T): Promise<SMTPTransport.SentMessageInfo> {
        const template = fs.readFileSync(`${process.cwd()}/src/shared/templates/html/support.html`, 'utf8');
        const compiledTemplate = handlebars.compile(template);
        const html = compiledTemplate(entity);

        const info = await this.createNewTransport().sendMail({
            from: `${entity?.email}`, // sender address
            to: `"Ecommerce 👻" <ecommerce.app@example.com>`, // list of receivers
            subject: 'OTP FOR CHANGE PASSWORD ✔', // Subject line
            html: `${html}` // html body
        });
        return info;
    }

    /** overding sendEmailConfirmOrder method */
    async sendEmailConfirmOrder(entity: T): Promise<SMTPTransport.SentMessageInfo> {
        const template = fs.readFileSync(`${process.cwd()}/src/shared/templates/hmtl/confirmOrder.html`, 'utf8');
        const compiledTemplate = handlebars.compile(template);

        // register helper if need
        handlebars.registerHelper('formatDate', function (date) {
            return formatDate(date);
        });
        handlebars.registerHelper('cacularPrice', function (num1, num2) {
            return num1 * (1 - num2 / 100);
        });

        handlebars.registerHelper('cacularOneProduct', function (num1, num2, num3) {
            return num1 * (1 - num2 / 100) * num3;
        });

        let total: number = 0;
        handlebars.registerHelper('cacularTotalPrice', function (items) {
            items.map((item: ProductSizeModel) => {
                total = total + item?.price! * (1 - item?.discount! / 100) * item?.qty!;
            });
            return total;
        });

        let coupon: number = 0;
        handlebars.registerHelper('cacularTotalCoupon', function (items) {
            items.map((item: ProductSizeModel) => {
                coupon = coupon + item?.price! * (entity?.dicount || 0 / 100) * item?.qty!;
            });
            return coupon;
        });

        handlebars.registerHelper('addTwoNumAndFormatCurrency', function () {
            return total - coupon;
        });

        const html = compiledTemplate(entity);

        const info = await this.createNewTransport().sendMail({
            from: `"Ecommerce 👻" <ecommerce.app@example.com>`, // sender address
            to: `${entity?.email}`, // list of receivers
            subject: 'ORDER CONFIRM INFORMATION ✔', // Subject line
            html: `${html}` // html body
        });
        return info;
    }
}
