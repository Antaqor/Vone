import { Types } from 'mongoose';
import User from '../models/User';

export async function adjustTrust(userId: Types.ObjectId, delta: number) {
  await User.findByIdAndUpdate(userId, { $inc: { trustScore: delta } }).exec();
}
