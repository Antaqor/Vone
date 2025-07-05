import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  profilePicture: string;
  trustScore: number;
  strikes: number;
  mutedUntil: Date | null;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  profilePicture: { type: String, default: '' },
  trustScore: { type: Number, default: 0 },
  strikes: { type: Number, default: 0 },
  mutedUntil: { type: Date, default: null }
});

export default model<IUser>('User', UserSchema);
