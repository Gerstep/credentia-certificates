import { Document, Schema, Model, model, HookNextFunction } from 'mongoose';
import { ICreateCredentialSubjectParams } from '../interfaces/controllers';

export interface ICredentialSubject extends ICreateCredentialSubjectParams, Document {
  credentialSubjectDetailIds: string[];
  txId: string;
  abi: string;
  expirationDate: Date;
  updatedAt: Date;
  createdAt: Date;
}

export const CredentialSubjectSchema = new Schema({
  name: String,
  issuerId: { type: Schema.Types.ObjectId, ref: 'Issuer' },
  holderId: { type: Schema.Types.ObjectId, ref: 'User' },
  credentialSubjectDetailIds: [{type: Schema.Types.ObjectId, ref: 'CredentialSubjectDetail'}],
  degreeId: String,
  txId: String,
  abi: String,
  expirationDate: Date,
  updatedAt: Date,
  createdAt: Date,
});

CredentialSubjectSchema.pre<ICredentialSubject>('save',
        function(this: ICredentialSubject, next: HookNextFunction) {
  const now = new Date();

  if (!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now;
  next();
});

export const CredentialSubject: Model<ICredentialSubject> =
  model<ICredentialSubject>('CredentialSubject', CredentialSubjectSchema);
