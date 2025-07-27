import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// ✅ Custom interface with known _id type
export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'teacher' | 'admin';
  oauthProvider?: string;
  oauthId?: string;
  enrolledCourses?: mongoose.Types.ObjectId[]; // student
  createdCourses?: mongoose.Types.ObjectId[];  // teacher
}

// ✅ Extended mongoose.Document to include _id as ObjectId
export interface IUserDocument extends IUser, Document<Types.ObjectId> { }

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    oauthProvider: String,
    oauthId: String,
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  },
  { timestamps: true }
);

// ✅ Final export: strong typing
export const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', userSchema);
