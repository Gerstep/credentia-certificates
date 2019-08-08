import { Request } from 'express';
import { injectable }    from 'inversify';

import { CredentialSubjectDetail } from '../models';
import { ICreateCredentialSubjectDetailParams } from '../interfaces/controllers';

@injectable()
export class CredentialSubjectDetailDomain {

  getCredentialSubjectDetail(in_params: Request) {
    const p = {...in_params.query};
    delete p['limit'];
    delete p['page'];
    if(('limit' in in_params.query)&&('page' in in_params.query)) {
      return CredentialSubjectDetail.find(p).limit(+in_params.query.limit).skip((+in_params.query.limit) * (+in_params.query.page)).lean(true);
    } else {
      return CredentialSubjectDetail.find(p).lean(true);
    }
  }

  createCredentialSubjectDetail(credentialSubjectDetail: ICreateCredentialSubjectDetailParams) {
    return CredentialSubjectDetail.create(credentialSubjectDetail);
  }

  updateCredentialSubjectDetail(credentialSubjectDetail_id: string, credentialSubjectDetail: ICreateCredentialSubjectDetailParams) {
    return CredentialSubjectDetail.updateOne({_id: credentialSubjectDetail_id}, credentialSubjectDetail).lean(true);
  }

  deleteCredentialSubjectDetail(credentialSubjectDetail_id: string) {
    return CredentialSubjectDetail.findByIdAndDelete({_id: credentialSubjectDetail_id}).lean(true);
  }
}
