import type { Request, Response } from 'express';
import Post from '../models/Post';
import User from '../models/User';
import { adjustTrust } from '../utils/adjustTrust';

interface CreatePostBody {
  content?: string;
}

export async function createPost(
  req: Request,
  res: Response
) {
  const { content } = req.body || {};
  const image = (req as any).file?.filename;

  const post = await Post.create({
    user: (req as any).user._id,
    content,
    image,
    shadow: (req as any).shadow || false,
  });

  if (!(req as any).shadow) {
    await adjustTrust((req as any).user._id, 2);
  }

  res.status(201).json({ post });
}

export async function likePost(req: Request, res: Response) {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.likes.includes((req as any).user._id)) {
    return res.status(400).json({ error: 'Already liked' });
  }
  post.likes.push((req as any).user._id);
  await post.save();
  await adjustTrust((req as any).user._id, 1);
  res.json({ likes: post.likes.length });
}

interface CommentPostBody {
  content?: string;
}

export async function commentPost(
  req: Request,
  res: Response
) {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  post.comments.push({ user: (req as any).user._id, content: req.body.content || '' });
  await post.save();
  await adjustTrust((req as any).user._id, 1);
  res.json({ comments: post.comments });
}

export async function sharePost(req: Request, res: Response) {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  post.shares = (post.shares || 0) + 1;
  await post.save();
  await adjustTrust((req as any).user._id, 1);
  res.json({ shares: post.shares });
}

export async function reportPost(req: Request, res: Response) {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  post.reports = (post.reports || 0) + 1;
  await post.save();
  await adjustTrust(post.user, -10);
  if (post.reports >= 3) post.shadow = true;
  await post.save();
  res.json({ reports: post.reports });
}
