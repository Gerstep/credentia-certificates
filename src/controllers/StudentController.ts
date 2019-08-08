import {
  controller, httpDelete,
  httpGet,
  httpPost
} from 'inversify-express-utils';

import { BaseController }                            from './BaseController';
import { IDeleteCoursesParams } from '../interfaces/controllers';
import { AuthMiddleware }                            from '../middlewares/auth';
import { UserDomain }                                from '../domains/User';
import { UserType }                                  from '../models/user';
import { ICreateUserParams }                         from '../interfaces/domains';
import env                                           from '../environments/environment.local';

@controller('/issuer')
export class StudentController extends BaseController {

  constructor(private userDomain: UserDomain) {
    super();
  }

  @httpGet('/students', AuthMiddleware)
  async getStudents() {
    const ctx = this.httpContext;
    const issuerId = ctx.user.details.issuerIds[0];

    const students = await this.userDomain.getIssuerUsers(issuerId);
    return this.sendSuccessJSON(students);
  }

  @httpPost('/students', AuthMiddleware)
  async createStudent() {
    const ctx = this.httpContext;
    const issuerId = ctx.user.details.ambassadorIssuerId;
    const body = <ICreateUserParams>ctx.request.body;
    const { hostname, protocol } = ctx.request;
    const host = env.env === 'local' ? env.email.domain : hostname;
    const domain = `${protocol}://${host}`;
    const lang = ctx.request.i18n.languages[0];

    const params = {
      email: body.email,
      name: body.name,
      surname: body.surname,
      birthDate: body.birthDate,
      userType: UserType.Student,
      issuerId,
      lang,
      domain
    };

    // @ts-ignore
    const course = await this.userDomain.createUser(params, issuerId);
    return this.sendSuccessJSON(course);
  }

  @httpDelete('/students', AuthMiddleware)
  async deleteCourses() {
    const ctx = this.httpContext;
    // const issuerId = ctx.user.details.ambassadorIssuerId;
    const body = <IDeleteCoursesParams>ctx.request.body;
    const courseIds = body.courseIds;

    // @ts-ignore
    await this.courseDomain.deleteCourses(courseIds);
    return this.sendSuccessJSON();
  }
}
