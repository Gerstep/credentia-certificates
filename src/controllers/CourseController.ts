import {
  controller, httpDelete,
  httpGet,
  httpPost
} from 'inversify-express-utils';

import { CourseDomain } from '../domains/Course';

import { BaseController }                            from './BaseController';
import { ICreateCourseParams, IDeleteCoursesParams } from '../interfaces/controllers';
import { AuthMiddleware }                            from '../middlewares/auth';

@controller('/issuer')
export class CourseController extends BaseController {

  constructor(private courseDomain: CourseDomain) {
    super();
  }

  @httpGet('/courses', AuthMiddleware)
  async getCourses() {
    const ctx = this.httpContext;
    const issuerId = ctx.user.details.issuerIds[0];

    const courses = await this.courseDomain.getIssuerCourses(issuerId);
    return this.sendSuccessJSON(courses);
  }

  @httpPost('/courses', AuthMiddleware)
  async createCourse() {
    const ctx = this.httpContext;
    const issuerId = ctx.user.details.ambassadorIssuerId;
    const body = <ICreateCourseParams>ctx.request.body;

    // @ts-ignore
    const course = await this.courseDomain.createCourse(body.name, issuerId);
    return this.sendSuccessJSON(course);
  }

  @httpDelete('/courses', AuthMiddleware)
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
