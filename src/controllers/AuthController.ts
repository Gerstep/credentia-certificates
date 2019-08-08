import {
  controller,
  httpGet,
  httpPost
} from 'inversify-express-utils';
import { Request } from 'express';

import { UserDomain }     from '../domains/User';
import { ISignUpParams }  from '../interfaces/controllers';
import { BaseController } from './BaseController';
import env                from '../environments/environment.local';

@controller('/auth')
export class AuthController extends BaseController {

  constructor(private userDomain: UserDomain) {
    super();
  }

  @httpPost('/signup')
  async signup() {
    const ctx = this.httpContext;
    const body = <ISignUpParams>ctx.request.body;
    const { hostname } = ctx.request;
    const domain = env.env === 'local' ? 'credentia.localhost' : hostname;
    const lang = ctx.request.i18n.languages[0];

    const params = {
      email: body.email,
      password: body.password,
      name: body.name,
      surname: body.surname,
      userType: body.userType,
      issuerId: body.issuerId,
      birthDate: body.birthDate,
      lang,
      domain
    };

    await this.userDomain.createUser(params);
    return this.sendSuccessJSON();
  }

  @httpGet('/confirm')
  async confirm() {
    const { request } = this.httpContext;
    const code: string = request.query.code;
    const check = await this.userDomain.checkUserConfirmationLink(code);
    const host = env.env === 'local' ? env.frontend : '';

    if (!check) {
      return this.redirect(`${host}/app/error/invalid-link`);
    }

    return this.redirect(`${host}/app/login`);
  }

  @httpPost('/login')
  async login() {
    const request: Request = this.httpContext.request;
    const session = request.session!;
    const body = <{ email: string, password: string}>request.body;
    const {email, password} = body;

    const user = await this.userDomain.login(email, password);

    session!.userId = user._id;

    return this.sendSuccessJSON(user);
  }

  @httpPost('/logout')
  logout() {
    const request = this.httpContext.request;
    const session: Express.Session = request.session!;

    session!.userId = null;

    return this.sendSuccessJSON();
  }
}
