import {
  controller, httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from 'inversify-express-utils';

import { CertContentDomain } from '../domains/CertContent';

import { BaseController }                            from './BaseController';
import { ICertContentParams } from '../interfaces/controllers';
import { AuthMiddleware }                            from '../middlewares/auth';

@controller('/certdesigner-content')
export class CertContentController extends BaseController {

  constructor(private CertContentDomain: CertContentDomain) {
    super();
  }

  @httpGet('/')
  async getCertContents() {
    const ctx = this.httpContext;
    const {id, name, value} = ctx.request.query;

    const CertContents = await this.CertContentDomain.getCertContents({id, name, value});
    return this.sendSuccessJSON(CertContents);
  }

  @httpPost('/')
  async createCertContent() {
    const ctx = this.httpContext;
    const body = <ICertContentParams>ctx.request.body;
    try {
      const CertContent = await this.CertContentDomain.createCertContent(body);
      return this.sendSuccessJSON(CertContent);
    } catch (e) {
      return this.sendErrorJSON(e.message, 500);
    }
  }

  @httpPut('/')
  async updateCertContent() {
    const ctx = this.httpContext;
    const body = <ICertContentParams>ctx.request.body;
    const id = ctx.request.query.id;
    try {
      const CertContent = await this.CertContentDomain.updateCertContent(id, body);
      return this.sendSuccessJSON(CertContent);
    } catch (e) {
      return this.sendErrorJSON(e.message, 500);
    }
  }

  @httpDelete('/', AuthMiddleware)
  async deleteCertContents() {
    const ctx = this.httpContext;
    const body = <ICertContentParams>ctx.request.body;

    // @ts-ignore
    await this.CertContentDomain.deleteCertContents([body.CertContentId]);
    return this.sendSuccessJSON();
  }
}
