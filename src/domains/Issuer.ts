import { injectable }    from 'inversify';

import { IIssuer, Issuer } from '../models/issuer';

@injectable()
export class IssuerDomain {

  getIssuer(issuerId: string): Promise<IIssuer> {
    return Issuer.findById(issuerId).lean().exec();
  }

  createIssuer(name: string, address: string, phone: string) {
    return Issuer.create({name, address, phone});
  }

  updateIssuer(issuerId: string, data: {name?: string; address?: string; phone?: string;}): Promise<IIssuer> {
    return Issuer.findByIdAndUpdate(issuerId, data, {new: true}).lean().exec();
  }

  deleteIssuer(issuerId: string): Promise<void> {
    return Issuer.findByIdAndDelete(issuerId).lean().exec();
  }
}
