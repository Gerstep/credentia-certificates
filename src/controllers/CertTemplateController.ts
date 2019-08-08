import {
    controller,
    httpDelete,
    httpGet,
    httpPost,
    httpPut
  } from 'inversify-express-utils';

import { CertTemplateDomain } from '../domains/CertTemplate';

import { BaseController }                            from './BaseController';
import { ICreateCertTemplateParams } from '../interfaces/controllers';
import { AuthMiddleware }                            from '../middlewares/auth';

@controller('/certdesigner-template')
  export class CertTemplateController extends BaseController {

    constructor(private CertTemplateDomain: CertTemplateDomain) {
      super();
    }

    @httpGet('/')
    async getCertTemplates() {
      const ctx = this.httpContext;
      const {search} = ctx.request.query;

      const CertTemplates = await this.CertTemplateDomain.getCertTemplatesByStr(search);
      return this.sendSuccessJSON(CertTemplates);
    }

    @httpGet('/my', AuthMiddleware)
    async getMyCertTemplates() {
      const ctx = this.httpContext;
      const issuerId = ctx.user.details.issuerIds[0];

      const CertTemplates = await this.CertTemplateDomain.getCertTemplatesByCreator(issuerId);
      return this.sendSuccessJSON(CertTemplates);
    }

    @httpPut('/')
    async updateCertTemplate() {
      const ctx = this.httpContext;
      const id = ctx.request.query.id;
      const body = <ICreateCertTemplateParams>ctx.request.body;
      return this.sendSuccessJSON(await this.CertTemplateDomain.updateCertTemplate(id, body));
    }

    @httpPost('/')
    async createCertTemplate() {
      const ctx = this.httpContext;
      const issuerId = ctx.user.details.ambassadorIssuerId;
      const body = <ICreateCertTemplateParams>ctx.request.body;

      const CertTemplate = await this.CertTemplateDomain.createCertTemplate(body, issuerId);
      return this.sendSuccessJSON(CertTemplate);
    }

    @httpDelete('/', AuthMiddleware)
    async deleteCertTemplates() {
      const ctx = this.httpContext;
      const body = <ICreateCertTemplateParams>ctx.request.body;

      // @ts-ignore
      await this.CertTemplateDomain.deleteCertTemplates([body.certTemplateId]);
      return this.sendSuccessJSON();
    }
  }
