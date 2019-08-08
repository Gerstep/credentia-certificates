import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
}                 from 'inversify-express-utils';

import { CredentialSubjectDomain }                     from '../domains/CredentialSubject';
import { BaseController }                              from './BaseController';
import { ICreateCredentialSubjectParams, ICertDeploy } from '../interfaces/controllers';
import { SmartContract }                               from '../services/SmartContract';

@controller('/credentialsubject')
export class CredentialSubjectController extends BaseController {

  constructor(private credentialSubjectDomain: CredentialSubjectDomain, private smartContract: SmartContract) {
    super();
  }

  @httpGet('/')
  async getCredentialSubject() {
    const ctx = this.httpContext;
    const issuerId = ctx.user.details.issuerIds[0];

    const credentialSubject = await this.credentialSubjectDomain.getCredentialSubjects(issuerId);
    return this.sendSuccessJSON(credentialSubject);
  }

  @httpPost('/')
  async createCredentialSubject() {
    const ctx = this.httpContext;
    const issuerId = ctx.user.details.issuerIds[0];
    const body = <ICreateCredentialSubjectParams>ctx.request.body;
    const { name, holderId, degreeId, grades = [] } = body;
    const params = {
      name, // Diplom name
      issuerId, // Issuer ref
      holderId, // Holder ref
      degreeId, // degree
      grades
    };

    const credentialSubject = await this.credentialSubjectDomain.createCredentialSubject(params);
    return this.sendSuccessJSON(credentialSubject);
  }

  @httpPut('/')
  async updateCredentialSubject() {
    const ctx = this.httpContext;
    const body = <ICreateCredentialSubjectParams>ctx.request.body;
    const csId = ctx.request.query._id;
    const credentialSubject = await this.credentialSubjectDomain.updateCredentialSubject(csId, body);
    return this.sendSuccessJSON(credentialSubject);
  }

  @httpDelete('/')
  async deleteCredentialSubject() {
    const ctx = this.httpContext;
    const cs_id = ctx.request.query._id;
    const CredentialSubject = await this.credentialSubjectDomain.deleteCredentialSubject(cs_id);
    return this.sendSuccessJSON(CredentialSubject);
  }

  @httpPost('/deploy')
  async getCert() {
    const ctx = this.httpContext;
    const body = <ICertDeploy>ctx.request.body;
    const csId = body.credentialSubjectId;
    const credentialSubject = await this.credentialSubjectDomain.signCredentialSubject(csId);
    return this.sendSuccessJSON(credentialSubject);
  }

  @httpPost('/resign')
  async resignCert(){
    const ctx = this.httpContext;
    const body = <ICertDeploy>ctx.request.body;
    const csId = body.credentialSubjectId;
    const txId = await this.credentialSubjectDomain.resignCredentialSubject(csId);
    return this.sendSuccessJSON(txId);
  }

  @httpGet('/smdata')
  async smdata() {
    const ctx = this.httpContext;
    const csId = ctx.request.query.id;
    const cs = await this.credentialSubjectDomain.getCredentialSubjectById(csId);
    const data = await this.smartContract.getSMData(cs.txId, JSON.parse(cs.abi));

    if (cs.txId && cs.abi) {
      return JSON.stringify(data,null,2);
    } else {
      return this.sendSuccessJSON("Txid or Abi is not found.");
    }
  }

  @httpGet('/json-ld')
  async jsonLd() {
    const ctx = this.httpContext;
    const csId = ctx.request.query.id;
    return this.sendSuccessJSON(await this.credentialSubjectDomain.getJson(csId));
  }
}
