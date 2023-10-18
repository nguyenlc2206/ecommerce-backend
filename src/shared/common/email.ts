// * import libs
import { Service } from 'typedi';
import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

// * import projects
import ENV from '@ecommerce-backend/src/main/config/env';
import { KeyedObject } from '@ecommerce-backend/src/shared/types';
import { EmailMethods } from '@ecommerce-backend/src/shared/methods/email';

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
        const info = await this.createNewTransport().sendMail({
            from: `"Ecommerce 👻" <lcn@example.com>`, // sender address
            to: `${entity?.email}`, // list of receivers
            subject: 'OTP FOR CHANGE PASSWORD ✔', // Subject line
            text: `Your OTP is ${entity?.OTP}`, // plain text body
            html: `<b>Your OTP is ${entity?.OTP}</b>` // html body
        });
        return info;
    }
}
