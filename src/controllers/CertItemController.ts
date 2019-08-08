import {
    controller, httpDelete,
    httpGet,
    httpPost,
    httpPut,
  } from 'inversify-express-utils';

import { CertItemDomain } from '../domains/CertItem';

import { BaseController }                            from './BaseController';
import { ICertItemParams } from '../interfaces/controllers';
import { AuthMiddleware }                            from '../middlewares/auth';

@controller('/certdesigner-item')
  export class CertItemController extends BaseController {

    constructor(private CertItemDomain: CertItemDomain) {
      super();
    }

    @httpGet('/')
    async getCertItems() {
      const ctx = this.httpContext;
      const search: string = ctx.request.query.search;
      const id: string = ctx.request.query.id;

      const CertItems = await this.CertItemDomain.getCertItems(id, search);
      return this.sendSuccessJSON(CertItems);
    }

    @httpPost('/')
    async createCertItem() {
      const ctx = this.httpContext;
      const body = <ICertItemParams>ctx.request.body;
      try {
        const CertItem = await this.CertItemDomain.createCertItem(body);
        return this.sendSuccessJSON(CertItem);
      } catch (e) {
        return this.sendErrorJSON(e.message, 500);
      }
    }

    @httpPut('/')
    async updateCertItem() {
      const ctx = this.httpContext;
      const body = <ICertItemParams>ctx.request.body;
      const id = ctx.request.query.id;
      try {
        const CertItem = await this.CertItemDomain.updateCertItem(id, body);
        return this.sendSuccessJSON(CertItem);
      } catch (e) {
        return this.sendErrorJSON(e.message, 500);
      }
    }

    @httpDelete('/', AuthMiddleware)
    async deleteCertItems() {
      const ctx = this.httpContext;
      const body = <ICertItemParams>ctx.request.body;

      // @ts-ignore
      await this.CertItemDomain.deleteCertItems([body.CertItemId]);
      return this.sendSuccessJSON();
    }
  }
