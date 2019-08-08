import {
    controller, // httpDelete,
    httpGet,
    httpPost
  } from 'inversify-express-utils';

import { CertRelDomain } from '../domains/CertRel';
import { BaseController } from './BaseController';
// import { ICertRelParams } from '../interfaces/controllers';
import { ICertRel } from '../models/cert_rel';
// import { AuthMiddleware } from '../middlewares/auth';

@controller('/certdesigner-rel')
  export class CertRelController extends BaseController {

    constructor(private CertRelDomain: CertRelDomain) {
      super();
    }

    @httpGet('/')
    async getCertRels() {
      const ctx = this.httpContext;
      const {id, certTemplateId, certParentId} = ctx.request.query;
      if((id && certTemplateId && certParentId)||(id && certTemplateId)||(certTemplateId && certParentId)||(id && certParentId)){
        return this.sendErrorJSON('Input parameters must be mutually exclusive.', 500);
      }
      if(id) {
        return this.sendSuccessJSON(await this.CertRelDomain.getCertRelsById(id));
      }
      return this.sendSuccessJSON(await this.CertRelDomain.getCertRels({ certTemplateId, certParentId }));
    }
    @httpPost('/')
    async createCertRel() {
      const ctx = this.httpContext;
      const body = <ICertRel>ctx.request.body;
      try {
        const CertRel = await this.CertRelDomain.createCertRel(body);
        return this.sendSuccessJSON(CertRel);
      } catch (error) {
        return this.sendErrorJSON(error.message, 500);
      }
    }
    @httpPost('/full')
    async createCertRelFull() {
      const ctx = this.httpContext;
      const body = ctx.request.body;
      try {
        const CertRel = await this.CertRelDomain.createCertRelFull(body);
        return this.sendSuccessJSON(CertRel);
      } catch (error) {
        return this.sendErrorJSON(error.message, 500);
      }
    }
    // @httpDelete('/', AuthMiddleware)
    // async deleteCertRels() {
    //   const ctx = this.httpContext;
    //   const body = <ICreateCertRelParams>ctx.request.body;

    //   // @ts-ignore
    //   await this.CertRelDomain.deleteCertRels([body.CertRelId]);
    //   return this.sendSuccessJSON();
    // }
  }
