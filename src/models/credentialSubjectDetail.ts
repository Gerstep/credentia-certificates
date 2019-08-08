import { Document, Schema, Model, model, HookNextFunction } from 'mongoose';
import { ICreateCredentialSubjectDetailParams } from '../interfaces/controllers';

export interface ICredentialSubjectDetail extends ICreateCredentialSubjectDetailParams, Document {
  updatedAt: Date;
  createdAt: Date;
}

export const CredentialSubjectDetailSchema = new Schema({
  // credentialSubjectId: Schema.Types.ObjectId, // Diplom ref
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' }, // Course ref (example, Math)
  grade: String,
  updatedAt: Date,
  createdAt: Date
});

CredentialSubjectDetailSchema.pre<ICredentialSubjectDetail>('save',
        function(this: ICredentialSubjectDetail, next: HookNextFunction) {
  const now = new Date();

  if (!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now;
  next();
});

export const CredentialSubjectDetail: Model<ICredentialSubjectDetail> =
  model<ICredentialSubjectDetail>('CredentialSubjectDetail', CredentialSubjectDetailSchema);
