import path               from 'path';
import {
  controller,
  httpGet
} from 'inversify-express-utils';
import i18next                                    from 'i18next';

import { BaseController } from './BaseController';
import Template           from 'marko/src/runtime/html/Template';
import env                from '../environments/environment.local';

// tslint:disable-next-line:no-var-requires
const confirmEmail: Template = require(path.resolve(__dirname, '../files/templates/emails/reg_confirm.marko'));

@controller('/test')
export class TestController extends BaseController {

  @httpGet('/email/confirm')
  async testConfirmEmail() {
    const ctx = this.httpContext;
    const query = ctx.request.query;
    const { hostname } = ctx.request;
    const defaultDomain = env.env === 'local' ? env.email.domain : hostname;
    const defaulLang = ctx.request.i18n.languages[0];
    const { password, fullName, lang, domain, link, userType } = query;
    const t = i18next.t.bind(i18next);
    const data = {
      t, password, link, fullName, userType, lang: lang || defaulLang, domain: domain || defaultDomain
    };

    const html: string = await new Promise((res, rej) => {
      confirmEmail.renderToString(data, (err, result) => {
        if (err) {
          rej(err);
        } else {
          res(result);
        }
      });
    });

    this.httpContext.response.contentType('html');
    this.httpContext.response.status(200);
    this.httpContext.response.send(html);
  }
}
