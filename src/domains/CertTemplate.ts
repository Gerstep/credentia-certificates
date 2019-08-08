import { injectable } from 'inversify';

import { CertTemplate, ICertTemplate } from '../models/cert_template';
import { CertRel } from '../models/cert_rel';
import { CertItem } from '../models/cert_item';
import { CertIssue } from '../models/cert_issue';
import { ICreateCertTemplateParams } from '../interfaces/controllers';

@injectable()
export class CertTemplateDomain {
  async isUsed(id: string) {
    const n = await CertTemplate.findById(id).countDocuments();
    if(n===0) {
      throw new Error('The Template is not found.');
    } else {
      const k = CertIssue.find({certTemplateId: id}).countDocuments();
      const m = CertItem.find({certTemplateId: id}).countDocuments();
      const [rk, rm] = await Promise.all([k, m]);
      if(rk===0&&rm===0) {
        return false;
      } else {
        return true;
      }
    }
  }
  // getCertTemplateById(certTemplateId: string) {
  //   return CertTemplate.findById(certTemplateId).lean(true);
  // }
  // cloneCertTemplate(id: string) {

  //   return
  // }

  getCertTemplatesByCreator(creatorId: string) {
    return CertTemplate.find({creatorId}).lean(true);
  }

  getCertTemplatesByStr(search: string) {
    // tslint:disable-next-line:max-line-length
    return CertTemplate.find({$or:[{name: { $regex: '.*' + search + '.*' } }, {description: { $regex: '.*' + search + '.*' } }]}).lean(true);
  }

  async createCertTemplate(certTemplate: ICreateCertTemplateParams, creatorId: string) {
    return await CertTemplate.create({...certTemplate, creatorId});
  }

  async updateCertTemplate(id: string, certTemplate: ICreateCertTemplateParams, creatorId: string) {
    if(this.isUsed(id)) {
      const {_id, version, parentId, ...cert} = await CertTemplate.findById(id).lean(true);
      const newCert = await CertTemplate.create({...cert, parentId: _id, version: version + 1, creatorId});

      const certRels = await CertRel.find({certTemplateId: id}).lean(true);
      const certRelsReMap = Array.from(certRels, (x: ICertTemplate)=> {

        const {_id: myId, ...extRel} = x;
        extRel.parentTemplateId = newCert._id;
        CertRel.create({...extRel});
        return extRel;
      });

      return newCert;
    } else {
      return await CertTemplate.findByIdAndUpdate(id, certTemplate, {new: false}).lean(true);
    }
  }

  deleteCertTemplates(certTemplateIds: string[]) {
    return CertTemplate.deleteMany({_id: { $in: certTemplateIds } } ).exec();
  }
}
