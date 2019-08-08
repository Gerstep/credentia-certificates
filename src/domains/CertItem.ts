import { injectable } from 'inversify';

import { CertItem } from '../models/cert_item';
import { ICertItemParams } from '../interfaces/controllers';

@injectable()
export class CertItemDomain {
  getCertItems(id: string, search: string) {
    return CertItem.find({...(id ? { _id: id } : {}),
                          ...(search ? { $or: [{name: { $regex: '.*' + search + '.*' }},
                                               {description: { $regex: '.*' + search + '.*' }}] } : {}),}).lean(true);
  }

  async checkUnq(certItem) {
    const flt = {...(certItem.contextUrl? {contextUrl: certItem.contextUrl}: certItem.name? {name: certItem.name}: {})};

    const n = await CertItem.find({...flt}).countDocuments();
    if(n>0) { throw new Error('The Item already exists.'); }
    return true;
  }

  async createCertItem(certItem: ICertItemParams) {
    await this.checkUnq(certItem);
    return await CertItem.create(certItem);
  }

  async updateCertItem(certItemId: string, certItem: ICertItemParams) {
    await this.checkUnq(certItem);
    return await CertItem.findByIdAndUpdate(certItemId, certItem, {new: true}).lean(true);
  }

  deleteCertItems(certItemIds: string[]) {
    return CertItem.deleteMany({_id: { $in: certItemIds } } ).exec();
  }
}
