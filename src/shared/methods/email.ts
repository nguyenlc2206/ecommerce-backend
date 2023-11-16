// * import libs
import SMTPTransport from 'nodemailer/lib/smtp-transport';

/** @todo: define email methods functions */
export interface EmailMethods<Entity> {
    sendEmailChangePassword(entity: Entity): Promise<SMTPTransport.SentMessageInfo>;
    sendEmailConfirmOrder(entity: Entity): Promise<SMTPTransport.SentMessageInfo>;
    sendEmailSupport(entity: Entity): Promise<SMTPTransport.SentMessageInfo>;
}
