import mongoose, { Schema, Document, Types, Model } from 'mongoose';

export interface ICourse {
  title: string;
  description: string;
  category: string;
  teacher: Types.ObjectId;
  lessons: Types.ObjectId[];
  enrolledStudents: Types.ObjectId[];
}

export interface ICourseDocument extends ICourse, Document {}

const courseSchema = new Schema<ICourseDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Course: Model<ICourseDocument> = mongoose.model<ICourseDocument>('Course', courseSchema);
