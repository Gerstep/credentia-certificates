import { Document, Schema, Model, model, HookNextFunction } from 'mongoose';

export interface ICertIssue {
  _id: any;
  name: string;
  certTemplateId: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface ICertIssueDocument extends ICertIssue, Document {}

export const CertIssueSchema = new Schema({
  name: String,
  certTemplateId: String,
  updatedAt: Date,
  createdAt: Date
});

CertIssueSchema.pre<ICertIssueDocument>('save', function(this: ICertIssueDocument, next: HookNextFunction) {
  const now = new Date();

  if (!this.createdAt) {
    this.createdAt = now;
  }

  this.updatedAt = now;
  next();
});

export const CertIssue: Model<ICertIssueDocument> = model<ICertIssueDocument>('CertIssue', CertIssueSchema);
