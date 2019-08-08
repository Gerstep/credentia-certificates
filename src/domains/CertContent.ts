import { injectable } from 'inversify';

import { CertContent, ICertContent } from '../models/cert_content';
// import { ICertContentParams } from '../interfaces/controllers';

@injectable()
export class CertContentDomain {
  getCertContents({id, name, value}: {id: string; name: string; value: string}) {
    console.log(id,name,value);
    return CertContent.find({}).lean(true);
  }

  async cerateOrUpdateCertContent(certContent: ICertContent[]) {
    const p = [];
    for(const i of certContent) {
      if(i._id) {
        const {_id, ...params} = i;
        p.push(CertContent.findByIdAndUpdate(_id, params));
      } else {
        p.push(CertContent.create(certContent));
      }
    }
    return await Promise.all(p);
  }

  deleteCertContents(certContentIds: string[]) {
    return CertContent.deleteMany({_id: { $in: certContentIds } } ).exec();
  }
}
