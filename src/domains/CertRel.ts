import { injectable } from 'inversify';
import { CertRel, ICertRel } from '../models/cert_rel';
// import { ICertRelParams } from '../interfaces/controllers';

@injectable()
export class CertRelDomain {
  checksForCreate(certRel: ICertRel[], rootFlg: boolean) {
    for(const i of certRel) {
          // checks
          if(!i.certTemplateId) { throw new Error('The certTemplateId field should be defined.'); }
          // if root
          if(rootFlg) {
            if(i.certParentId) {
              throw new Error('There should not be The certItemParentId field of the root item.');
            } else {
              const templateIds = Array.from(certRel, (x: ICertRel) => x.certTemplateId);
              if([...new Set(templateIds)]!==templateIds) {
                throw new Error('There can be only one root.');
              }
            }
          }
          // if not root
          if (!rootFlg && i.certParentId) {
            throw new Error('The certItemParentId field should be defined.');
          }
    }
    return true;
  }
  async walking(certRelArr: ICertRel[]) {  // Array<ICertRel>
    for(const i of certRelArr) {
      const rows = await CertRel.find({certParentId: i._id}).lean(true);
      if(rows) {
        return {...i, certChilds: await this.walking(rows)};
      } else {
        return i;
      }
    }
  }

  async getCertRelsById(id: string) {
    return CertRel.findById(id).lean(true);
  }

  async getCertRels({ certTemplateId, certParentId }: { certTemplateId: string; certParentId: string; }) {
    // tslint:disable-next-line:max-line-length
    const initRows = await CertRel.find({...(certParentId ? {certParentId}: certTemplateId ? {certTemplateId, certParentId: undefined}: {})}).lean(true);
    return this.walking(initRows);
  }

  async createCertRel(certRel: ICertRel) {
    if(!certRel.certTemplateId) {throw new Error('The certTemplateId field should be defined.'); }
    const n = await CertRel.find({certTemplateId: certRel.certTemplateId}).countDocuments();

    if(n===0 && certRel.certParentId) {
      // tslint:disable-next-line:max-line-length
      throw new Error('The ParentId field should not have the value until CertRel have no rows of TemplateId. Root required.');
    } else if(n>0 && !certRel.certParentId) {
      throw new Error('There can be only one root.');
    } else {
      return await CertRel.create(certRel);
    }
  }

  updateCertRel(сertRelId: string, certRel: ICertRel) {
    return CertRel.findByIdAndUpdate(сertRelId, certRel).lean(true);
  }

  async createCertRelFull(certRel: any, rootFlg: boolean = true) {
    if(this.checksForCreate(certRel, rootFlg)) {
      for(const i of certRel) {
        if(i._id) {
          const {_id, ...params} = i;
          await CertRel.findByIdAndUpdate(_id, params);
          this.createCertRelFull(i.certChilds, false);
        } else {
          await CertRel.create(certRel);
          this.createCertRelFull(i.certChilds, false);
        }
      }
    }
  }

  async deleteCertRels(сertRelIds: string[]) {
    await CertRel.deleteMany({_id: { $in: сertRelIds } } ).exec();
    const rows = await CertRel.find({certParentId: {$in: сertRelIds }}).lean(true);
    if (rows) {
      const ids = Array.from(rows, (x: ICertRel) => x._id);
      await this.deleteCertRels(ids);
    }
    return 'ok';
  }
}
