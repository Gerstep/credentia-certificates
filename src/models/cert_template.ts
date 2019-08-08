import { Document, Schema, Model, model, HookNextFunction } from 'mongoose';

export interface ICertTemplate {
  _id: any;
  name: string;
  description: string;
  parentTemplateId: string;
  version: number;
  creatorId: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface ICertTemplateDocument extends ICertTemplate, Document {}

export const CertTemplateSchema = new Schema({
  name: String,
  description: String,
  parentTemplateId: String,
  version: Number,
  creatorId: String,
  updatedAt: Date,
  createdAt: Date
});

CertTemplateSchema.pre<ICertTemplateDocument>('save', function(this: ICertTemplateDocument, next: HookNextFunction) {
  const now = new Date();

  if (!this.createdAt) {
    this.createdAt = now;
    this.version = 1;
  }

  this.updatedAt = now;
  next();
});

// tslint:disable-next-line:max-line-length
export const CertTemplate: Model<ICertTemplateDocument> = model<ICertTemplateDocument>('CertTemplate', CertTemplateSchema);
