import { Document, Schema, Model, model, HookNextFunction } from 'mongoose';
import { IIssuer }                                                    from './issuer';

export enum UserStatus {
  Unverified = 'unverified', Active = 'active'
}

export enum UserType {
 IssuerAmbassador = 'issuer_ambassador', Student = 'student', Admin = 'admin'
}

export interface IUser {
  _id: any;
  email: string;
  password: string;
  type: UserType;
  status: UserStatus;
  name: string;
  surname: string;
  birthDate?: Date;
  issuerIds: IIssuer[];
  updatedAt: Date;
  createdAt: Date;
  hash: string;
  privateKey: string;
}

export interface IUserDocument extends IUser, Document {}

export const UsersSchema: Schema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: UserType,
    enum: UserType
  },
  status: {
    type: UserStatus,
    enum: UserStatus,
    default: UserStatus.Unverified
  },
  name: String,
  surname: String,
  issuerIds: [{ type: Schema.Types.ObjectId, ref: 'Issuer' }],
  birthDate: Date,
  updatedAt: Date,
  createdAt: Date,
  hash: String,
  privateKey: String
});

// tslint:disable-next-line:only-arrow-functions
UsersSchema.virtual('ambassadorIssuerId').get(function(this: IUserDocument) {
  const issuerId = this.issuerIds[0];

  return this.populated('issuerIds') ? issuerId : issuerId.toString();
});

UsersSchema.pre<IUserDocument>('save', function(this: IUserDocument, next: HookNextFunction) {
  const now = new Date();

  if (!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now;
  next();
});

export const User: Model<IUserDocument> = model<IUserDocument>('User', UsersSchema);
