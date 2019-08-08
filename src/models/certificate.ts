import { Document, Schema, Model, model, HookNextFunction } from 'mongoose';

export interface ICertificate {
  _id: any;
  name: string;
  hash: string; // eth address of smart contract
  issuerHash: string; // eth address of issuer
  issuerId: string;
  studentId: string;
  type: string[];
  issuanceDate: Date;
  // TODO proofs one or many?
  proofs: {
    type: string;
    createdAt: Date;
    signature: string;
  };
  expirationDate: Date;
  status: string;
  credentialSubject: {
    _id: string; // Holder
    name: string; // Holder name
    hash: string; // Holder eth address
    // TODO course one or many?
    course: [{
      _id: string; // course
      name: string; // course name
      grade: number; // total grade of the Course
    }]
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ICertificateDocument extends ICertificate, Document {}

export const CertificateSchema = new Schema({
  name: String,
  hash: String, // eth address of smart contract
  issuerHash: String, // eth address of issuer
  issuerId: Schema.Types.ObjectId, // issuer id
  studentId: String,
  type: [String],
  issuanceDate: Date,
  proofs: {
    type: String,
    createdAt: Date,
    signature: String,
  },
  expirationDate: Date,
  status: String,
  credentialSubject: {
    id: Schema.Types.ObjectId, // Holder
    name: String, // Holder name
    hash: String, // Holder eth address
    course: [{
      id: Schema.Types.ObjectId, // course
      name: String, // course name
      grade: String, // total grade of the Course
    }]
  },
  createdAt: Date,
  updatedAt: Date
});

CertificateSchema.pre<ICertificateDocument>('save', function(this: ICertificateDocument, next: HookNextFunction) {
  const now = new Date();

  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

export const Certificate: Model<ICertificateDocument> = model<ICertificateDocument>('Certificate', CertificateSchema);
