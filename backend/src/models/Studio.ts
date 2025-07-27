
import { Schema, model, Types, Document } from 'mongoose';

export interface IStudio extends Document {
  name: string;
  host: Types.ObjectId; 
  inviteCode: string;
  createdAt: Date;
}

const studioSchema = new Schema<IStudio>(
  {
    name: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    inviteCode: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Studio = model<IStudio>('Studio', studioSchema);
