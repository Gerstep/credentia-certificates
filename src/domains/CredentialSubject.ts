import { injectable } from 'inversify';

import { CredentialSubject, CredentialSubjectDetail, ICredentialSubject, Issuer } from '../models';
import { ICreateCredentialSubjectParams, IUpdateCredentialSubjectParams } from '../interfaces/controllers';
import { SmartContract }                                                  from '../services/SmartContract';
import { IUser }                                                          from '../models/user';
import { User } from '../models/user';

@injectable()
export class CredentialSubjectDomain {

  constructor(private contract: SmartContract) {
  }

  getCredentialSubjects(issuerId: string) {
    return CredentialSubject.find({issuerId})
      .populate({
        path: 'credentialSubjectDetailIds',
        populate: {
          path: 'courseId'
        }
      })
      .populate('holderId')
      .lean()
      .exec();
  }

  getCredentialSubjectById(id: string): Promise<ICredentialSubject> {
    return CredentialSubject.findById(id)
      .populate({
        path: 'credentialSubjectDetailIds',
        populate: {
          path: 'courseId'
        }
      })
      .populate('holderId')
      .lean()
      .exec();
  }

  async createCredentialSubject(params: ICreateCredentialSubjectParams) {
    const {grades, ...cs} = params;
    const csDetails = await Promise.all(grades.map(grade => {
      return CredentialSubjectDetail.create({
        // credentialSubjectId: Schema.Types.ObjectId, // Diplom ref
        courseId: grade.courseId, // Course ref (example, Math)
        grade: grade.grade
      });
    }));
    const credentialSubject = await CredentialSubject.create({
      name: cs.name,
      issuerId: cs.issuerId,
      holderId: cs.holderId,
      credentialSubjectDetailIds: csDetails.map(g => g._id),
      degreeId: cs.degreeId,
      expirationDate: new Date(2100, 0, 1)
    });

    return credentialSubject;
  }

  async updateCredentialSubject(csId: string, credentialSubject: IUpdateCredentialSubjectParams) {
    return CredentialSubject.updateOne({_id: csId}, credentialSubject, {new: true}).lean().exec();
  }

  deleteCredentialSubject(csIds: string[]) {
    return CredentialSubject.deleteMany({_id: {$in: csIds}}).exec();
  }

  async signCredentialSubject(csId: string) {
    const cs = await this.getCredentialSubjectById(csId); // for txId
    const csJson = await this.getJson(csId);
    const hash = (<IUser><unknown>cs.holderId).hash;

    const { txId, abi } = await this.contract.deployContract(hash, csJson); // cs);
    const abiStr = JSON.stringify(abi);
    return this.updateCredentialSubject(cs._id, {txId, abi: abiStr});
  }

  async resignCredentialSubject(csId: string){
    const cs = await this.getCredentialSubjectById(csId);
    const csJson = await this.getJson(csId);
    const txId = await this.contract.resignContract(cs.txId, JSON.parse(cs.abi), csJson);
    return txId
  }

  async getJson(csId: string) {
    const cs = await this.getCredentialSubjectById(csId);
    const {credentialSubjectDetailIds, issuerId, degreeId, expirationDate, holderId, _id} = cs;
    const {name, address, phone, ...issuerQs} = await Issuer.findById(issuerId);
    const holderQs = await User.findById(holderId);
    const result = {
      '@context': {
        holder: 'https://w3c.github.io/vc-data-model/#dfn-holders',
        issuanceDate: 'https://w3c.github.io/vc-data-model/#issuance-date-0',
        expirationDate: 'https://w3c.github.io/vc-data-model/#expiration-0',
        status: 'https://w3c.github.io/vc-data-model/#status-0',
        credentialSubject: 'https://w3c.github.io/vc-data-model/#credential-subject',
        type: 'https://w3c.github.io/vc-data-model/#dfn-verifiable-credentials'
      },
      id: _id,
      issuer: issuerQs['_id'],
      credentialSubject: {
        holder: holderQs,
        degree: degreeId,
        alumniOf: {
          university: name,
          address:address,
          phone: phone
        },
        cources: credentialSubjectDetailIds
      },
      expirationDate: expirationDate
    }
    return result;
  }
}
