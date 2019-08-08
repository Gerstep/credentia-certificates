import {
  controller,
  httpGet
}                 from 'inversify-express-utils';

import { BaseController } from './BaseController';
// import { UserDomain }     from '../domains/User';
import { AuthMiddleware } from '../middlewares/auth';

@controller('')
export class UserController extends BaseController {
  @httpGet('/user', AuthMiddleware)
  async getUser() {
    const user = this.httpContext.user.details;

    return this.sendSuccessJSON(user);
  }
}
