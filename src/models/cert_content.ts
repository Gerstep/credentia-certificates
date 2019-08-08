import { Document, Schema, Model, model, HookNextFunction } from 'mongoose';

export interface ICertContent {
  _id: any;
  certRelId: string;
  certItemId: string;
  value: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface ICertContentDocument extends ICertContent, Document {}

export const CertContentSchema = new Schema({
  certRelId: String,
  certItemId: String,
  value: String,
  updatedAt: Date,
  createdAt: Date
});

CertContentSchema.pre<ICertContentDocument>('save', function(this: ICertContentDocument, next: HookNextFunction) {
  const now = new Date();

  if (!this.createdAt) {
    this.createdAt = now;
  }

  this.updatedAt = now;
  next();
});

export const CertContent: Model<ICertContentDocument> = model<ICertContentDocument>('CertContent', CertContentSchema);
