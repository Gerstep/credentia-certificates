import { Document, Schema, Model, model, HookNextFunction } from 'mongoose';

export interface ICertItem {
  _id: any;
  name: string;
  description: string;
  dataType: string;
  dataFormat: string;
  contextUrl: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface ICertItemDocument extends ICertItem, Document {}

export const CertItemSchema = new Schema({
  name: String,
  description: String,
  dataType: String,
  dataFormat: String,
  contextUrl: String,
  updatedAt: Date,
  createdAt: Date
});

CertItemSchema.pre<ICertItemDocument>('save', function(this: ICertItemDocument, next: HookNextFunction) {
  const now = new Date();

  if (!this.createdAt) {
    this.createdAt = now;
  }

  this.updatedAt = now;
  next();
});

export const CertItem: Model<ICertItemDocument> = model<ICertItemDocument>('CertItem', CertItemSchema);
