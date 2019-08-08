import {
    controller,
    httpDelete,
    httpGet,
    httpPost,
    httpPut,
  }                 from 'inversify-express-utils';

import { CredentialSubjectDetailDomain } from '../domains/CredentialSubjectDetail';
import { BaseController } from './BaseController';
import { ICreateCredentialSubjectDetailParams }  from '../interfaces/controllers';

@controller('/api/credentialsubjectdetail')
  export class CredentialSubjectDetailController extends BaseController {

    constructor(private credentialSubjectDetailDomain: CredentialSubjectDetailDomain) {
      super();
    }

    @httpGet('/')
    async getCredentialSubjectDetail() {
      const ctx = this.httpContext;
      const req = ctx.request;
      const credentialSubjectDetail = await this.credentialSubjectDetailDomain.getCredentialSubjectDetail(req);
      return this.sendSuccessJSON(credentialSubjectDetail);
    }

    @httpPost('/')
    async createCredentialSubjectDetail() {
      const ctx = this.httpContext;
      const body = <ICreateCredentialSubjectDetailParams>ctx.request.body;
      const credentialSubjectDetail = await this.credentialSubjectDetailDomain.createCredentialSubjectDetail(body);
      return this.sendSuccessJSON(credentialSubjectDetail);
    }

    @httpPut('/')
    async updateCredentialSubjectDetail() {
      const ctx = this.httpContext;
      const body = <ICreateCredentialSubjectDetailParams>ctx.request.body;
      const cs_id = ctx.request.query._id;
      const credentialSubjectDetail = await this.credentialSubjectDetailDomain
        .updateCredentialSubjectDetail(cs_id, body);
      return this.sendSuccessJSON(credentialSubjectDetail);
    }

    @httpDelete('/')
    async deleteCredentialSubjectDetail() {
      const ctx = this.httpContext;
      const cs_id = ctx.request.query._id;
      const credentialSubjectDetail = await this.credentialSubjectDetailDomain.deleteCredentialSubjectDetail(cs_id);
      return this.sendSuccessJSON(credentialSubjectDetail);
    }
  }

