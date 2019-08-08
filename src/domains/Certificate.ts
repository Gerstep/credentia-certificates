import { Request } from 'express';
import { injectable } from 'inversify';

import { Certificate, ICertificate } from '../models/certificate';
import { Issuer }                    from '../models/issuer';

// import { CredentialSubject } from '../models/credentialSubject';

import { ICreateCertParams } from '../interfaces/controllers';

const host = 'http://localhost:3000/api/';

@injectable()
export class CertificateDomain {
  doc: any;
  context: any;
  constructor() {
    this.doc = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      hash: 'hash',
      issuerHash: 'issuerHash',
      holderHash: 'holderHash',
      type: ['typeString','type'],
      issuanceDate: 'issuanceDate',
      proofs: 'proofs',
      expirationDate: 'expirationDate',
      status: 'status',
      credentialSubject: 'credentialSubject',
      degree: 'degree',
      rawCert: 'rawCert'
    };
  }

  async getJSONLD(in_params: Request) {
    let qs;
    const p = {...in_params.query};
    delete p.limit;
    delete p.page;
    if(('limit' in in_params.query)&&('page' in in_params.query)) {
      qs = await Certificate.find(p)
        .limit(+in_params.query.limit)
        .skip((+in_params.query.limit) * (+in_params.query.page)).lean(true);
    } else {
      qs = await Certificate.find(p).lean(true);
    }

    const cnx = {
      issuer: {
        '@context': 'https://w3c.github.io/vc-data-model/#issuer-0'
      },
      /// holder: "https://w3c.github.io/vc-data-model/#dfn-holders",
      iissuanceDate: 'https://w3c.github.io/vc-data-model/#issuance-date-0',
      eexpirationDate: 'https://w3c.github.io/vc-data-model/#expiration-0',
      sstatus: 'https://w3c.github.io/vc-data-model/#status-0',
      ccredentialSubject: 'https://w3c.github.io/vc-data-model/#credential-subject',
      ttype: 'https://w3c.github.io/vc-data-model/#dfn-verifiable-credentials',
    };

    const r = [];
    for(const row of qs) {
      const data = row;
      data['@id'] = host + 'cert?_id='+row._id;

      const issuer = await Issuer.findById(row.issuerId).lean(true);
      issuer['@id']= host + 'issuer?_id='+row.issuerId;
      delete issuer._id;
      delete issuer._v;
      data.issuer = issuer;

      // const issuer = await Issuer.findById(row['issuerId']).lean(true);
      // issuer['@id']= host + 'issuer?_id='+row['issuerId'];
      // delete issuer['_id'];
      // delete issuer['_v'];
      // data['credential'] = issuer;

      // data['issuer'] = {'@id': host + 'issuer?_id='+row['issuerId']};
      // data['holder'] = {'@id': host + 'holder?_id='+row['holderId']};
      // const cs = CredentialSubject.find({_id: row['credentialSubjectId']});

/*
      delete data['_id'];
      delete data['issuerHash'];
      delete data['holderHash'];
      delete data['issuerId'];
      delete data['holderId'];
      delete data['createdAt'];
      delete data['hash'];
      delete data['_v'];
*/
      // delete data['credentialSubjectId'];

      // data['credentialSubject'] = cs;

      r.push({ '@context': cnx,...row});
    }
    return r;
  }

  getIssuerCertificates(issuerId: string): Promise<ICertificate[]> {
    return Certificate.find({issuerId}).lean().exec();
  }

  createCert(cert: ICreateCertParams) {
    return Certificate.create(cert);
  }

  updateCert(cert_id: string, cert: ICreateCertParams) {
    return Certificate.updateOne({_id: cert_id}, cert).lean(true);
  }
}
