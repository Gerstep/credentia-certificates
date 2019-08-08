import { Document, Schema, Model, model, HookNextFunction } from 'mongoose';

export interface IIssuer {
  _id: any;
  name: string;
  address: string;
  phone: string;
  hash: string;
  privateKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IIssuerDocument extends IIssuer, Document {}

export const IssuerSchema = new Schema({
  name: String,
  address: String,
  phone: String,
  hash: String,
  privateKey: String,
  createdAt: Date,
  updatedAt: Date
});

IssuerSchema.pre<IIssuerDocument>('save', function(this: IIssuerDocument, next: HookNextFunction) {
  const now = new Date();

  if (!this.createdAt) {
    this.createdAt = now;
  }

  // TODO move it to domain
  // if (!this.hash) {
  //   const wallet = eth();
  //   this.hash = wallet.address;
  //   this.privateKey = wallet.privateKey;
  // }
  this.updatedAt = now;
  next();
});

export const Issuer: Model<IIssuerDocument> = model<IIssuerDocument>('Issuer', IssuerSchema);
