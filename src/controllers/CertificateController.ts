import {
  controller,
  httpGet,
  httpPost,
  httpPut
}                 from 'inversify-express-utils';

import { CertificateDomain } from '../domains/Certificate';

import { BaseController }                         from './BaseController';
import { ICreateCertParams } from '../interfaces/controllers';

@controller('/certificates')
export class CertificateController extends BaseController {

  constructor(private certDomain: CertificateDomain) {
    super();
  }

   @httpGet('/jsonld')
   async getJsonLd() {
    const ctx = this.httpContext;
    const req = ctx.request;
    const res = await this.certDomain.getJSONLD(req);
    return this.sendSuccessJSON(res);
   }

  @httpGet('/')
  async getCertificates() {
    const ctx = this.httpContext;
    const issuerId = ctx.user.details.issuerIds[0];

    const Cert = await this.certDomain.getIssuerCertificates(issuerId);
    return this.sendSuccessJSON(Cert);
  }

  @httpPost('/')
  async createCertificate() {
    const ctx = this.httpContext;
    const body = <ICreateCertParams>ctx.request.body;
    const Cert = await this.certDomain.createCert(body);
    return this.sendSuccessJSON(Cert);
  }

  @httpPut('/')
  async updateCertificate() {
    const ctx = this.httpContext;
    const body = <ICreateCertParams>ctx.request.body;
    const cert_id = ctx.request.query._id;
    const Cert = await this.certDomain.updateCert(cert_id, body);
    return this.sendSuccessJSON(Cert);
  }
}
