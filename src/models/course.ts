import { Document, Schema, Model, model, HookNextFunction } from 'mongoose';

export interface ICourse {
  _id: any;
  name: string;
  issuerId: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface ICourseDocument extends ICourse, Document {}

export const CourseSchema = new Schema({
  name: String,
  issuerId: String,
  updatedAt: Date,
  createdAt: Date
});

CourseSchema.pre<ICourseDocument>('save', function(this: ICourseDocument, next: HookNextFunction) {
  const now = new Date();

  if (!this.createdAt) {
    this.createdAt = now;
  }

  this.updatedAt = now;
  next();
});

export const Course: Model<ICourseDocument> = model<ICourseDocument>('Course', CourseSchema);
