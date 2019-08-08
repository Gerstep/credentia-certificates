import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
}                 from 'inversify-express-utils';

import { IssuerDomain } from '../domains/Issuer';
import { BaseController } from './BaseController';
import { ICreateIssuerParams }  from '../interfaces/controllers';

@controller('/issuer')
export class IssuerController extends BaseController {

  constructor(private issuerDomain: IssuerDomain) {
    super();
  }

  @httpGet('/')
  async getIssuer() {
    const ctx = this.httpContext;
    const issuerId = ctx.user.details.issuerIds[0];
    const issuer = await this.issuerDomain.getIssuer(issuerId);
    return this.sendSuccessJSON(issuer);
  }

  @httpPost('/')
  async createIssuer() {
    const ctx = this.httpContext;
    const body = <ICreateIssuerParams>ctx.request.body;
    const { name, address, phone } = body;

    const issuer = await this.issuerDomain.createIssuer(name, address, phone);
    return this.sendSuccessJSON(issuer);
  }

  @httpPut('/')
  async updateIssuer() {
    const ctx = this.httpContext;
    const body = <ICreateIssuerParams>ctx.request.body;
    const issuerId = ctx.user.details.issuerIds[0];
    const { name, address, phone } = body;
    const params = {
      name,
      address,
      phone
    };

    const issuer = await this.issuerDomain.updateIssuer(issuerId, params);
    return this.sendSuccessJSON(issuer);
  }

  @httpDelete('/')
  async deleteCredentialSubject() {
    const ctx = this.httpContext;
    const cs_id = ctx.request.query._id;
    const issuer = await this.issuerDomain.deleteIssuer(cs_id);
    return this.sendSuccessJSON(issuer);
  }
}
