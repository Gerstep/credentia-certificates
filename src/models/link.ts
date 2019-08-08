import { Document, Schema, Model, model, HookNextFunction } from 'mongoose';

export interface ILink {
  _id: any;
  code: string;
  userId: string;
  createdAt: Date;
}

export interface ILinkDocument extends ILink, Document {}

export const LinksSchema: Schema = new Schema({
  code: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: Date
});

LinksSchema.pre<ILinkDocument>('save', function(this: ILinkDocument, next: HookNextFunction) {
  const now = new Date();

  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

export const Link: Model<ILinkDocument> = model<ILinkDocument>('Link', LinksSchema);
