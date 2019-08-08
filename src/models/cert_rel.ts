import { Document, Schema, Model, model, HookNextFunction } from 'mongoose';

export interface ICertRel {
  _id: any;
  certItemId: string;
  certParentId: string;
  certTemplateId: string;
  certChilds: any;
  updatedAt: Date;
  createdAt: Date;
}

export interface ICertRelDocument extends ICertRel, Document {}

export const CertRelSchema = new Schema({
  certItemId: String,
  certParentId: String,
  certTemplateId: String,
  updatedAt: Date,
  createdAt: Date
});

CertRelSchema.pre<ICertRelDocument>('save', function(this: ICertRelDocument, next: HookNextFunction) {
  const now = new Date();

  if (!this.createdAt) {
    this.createdAt = now;
  }

  this.updatedAt = now;
  next();
});

export const CertRel: Model<ICertRelDocument> = model<ICertRelDocument>('CertRel', CertRelSchema);
