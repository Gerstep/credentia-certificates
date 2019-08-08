import { injectable }                             from 'inversify';
// @ts-ignore
import sendpulse                                  from 'sendpulse-api';
import path                                       from 'path';
import i18next                                    from 'i18next';
import Template                                   from 'marko/src/runtime/html/Template';
/*
 TODO inject configs via inversify
 https://github.com/cvrabie/inversify-config-injection
* */
import env                                        from '../environments/environment';
import { Logger }                                 from './Logger';
import { ISendMailParams, ISendSignUpMailParams } from '../interfaces/services';

// tslint:disable-next-line:no-var-requires
const confirmEmail: Template = require(path.resolve(__dirname, '../files/templates/emails/reg_confirm.marko'));

@injectable()
export class Email {
  // @ts-ignore
  constructor(private logger: Logger) {
  }

  sendEmail = async (params: ISendMailParams) => {
    const {html, text, subject, from, to} = params;

    this.logger.debug('Sending email', {subject, from, to});
    const email: Promise<{ result: true }> = new Promise((res, rej) => {
      sendpulse.smtpSendMail((data: any) => {
        if (!data.result) {
          this.logger.error('Email service error', {
            response: data,
            from,
            to
          });
          rej(data);
        } else {
          res(data);
        }
        this.logger.debug(data);
      }, {
        html, text, subject, from,
        to: [{
          name: to.name,
          email: to.email
        }]
      });
    });

    return email;
  };

  sendSignupEmail = async (params: ISendSignUpMailParams) => {
    const {uuid, email, lang, fullName, domain, password, userType} = params;
    const link = `${domain}${env.email.confirmUrl}${uuid}`;
    const t = i18next.t.bind(i18next);
    const emailData = {t, fullName, link, lang, password, domain, userType};

    const html = await new Promise((res, rej) => {
      confirmEmail.renderToString(emailData, (err, result) => {
        if (err) {
          rej(err);
        } else {
          res(result);
        }
      });
    });

    const emailToSent = {
      html: <string>html,
      text: link,
      subject: i18next.t('emails.confirm.subject'),
      from: {
        name: env.email.name,
        email: env.email.email
      },
      to: {
        name: fullName,
        email
      }
    };

    return this.sendEmail(emailToSent);
  };
}
