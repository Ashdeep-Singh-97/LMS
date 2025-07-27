// models/Lesson.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ILesson {
  title: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  course: Types.ObjectId; // reference to Course
}

export interface ILessonDocument extends ILesson, Document {}

const lessonSchema = new Schema<ILessonDocument>(
  {
    title: { type: String, required: true },
    content: String,
    videoUrl: String,
    duration: Number,
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true }
  },
  { timestamps: true }
);

export const Lesson: Model<ILessonDocument> = mongoose.model<ILessonDocument>('Lesson', lessonSchema);
