import { Schema, model, Document, Types, models } from 'mongoose';

export interface IReply {
  user: Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface IComment {
  user: Types.ObjectId;
  content: string;
  createdAt: Date;
  replies: IReply[];
}

export interface IPost extends Document {
  user: Types.ObjectId;
  sharedFrom?: Types.ObjectId;
  content: string;
  image?: string;
  likes: Types.ObjectId[];
  comments: IComment[];
  shares?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReplySchema = new Schema<IReply>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CommentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [ReplySchema],
});

const PostSchema = new Schema<IPost>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sharedFrom: { type: Schema.Types.ObjectId, ref: 'Post' },
    content: { type: String, default: '' },
    image: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema],
    shares: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default (models.Post as ReturnType<typeof model<IPost>>) || model<IPost>('Post', PostSchema);

