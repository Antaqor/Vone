import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { pipeline } from '@xenova/transformers';
import User from '../models/User';
import Post from '../models/Post';
import { profanityList } from '../profanityList';

const redis = new Redis(process.env.REDIS_URL || '');

// ---------------------- verifyJWT ----------------------
export async function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET || 'secret') as any;
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    (req as any).user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// ---------------------- rateLimiter --------------------
const hitKey = (ip: string) => `post-limit-hits:${ip}`;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: req => `${req.ip}:${(req as any).user?._id || ''}`,
  store: new RedisStore({ sendCommand: (...args: string[]) => redis.call(...args) }),
  handler: async (req, res) => {
    await redis.incr(hitKey(req.ip));
    await redis.expire(hitKey(req.ip), 60 * 60);
    res.status(429).json({ error: 'Too many posts' });
  },
});
export const rateLimiter = limiter;

// ------------------- youngAccountThrottle ---------------
export async function youngAccountThrottle(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  const ageMs = Date.now() - new Date(user.createdAt).getTime();
  if (ageMs < 24 * 60 * 60 * 1000) {
    const oneHour = new Date(Date.now() - 60 * 60 * 1000);
    const count = await Post.countDocuments({ user: user._id, createdAt: { $gte: oneHour } });
    if (count >= 1) return res.status(429).json({ error: 'Too many posts' });
  }
  next();
}

// ---------------------- hCaptcha fallback ---------------
export async function hCaptchaFallback(req: Request, res: Response, next: NextFunction) {
  const ipHits = parseInt((await redis.get(hitKey(req.ip))) || '0');
  const user = (req as any).user;
  const ageMs = Date.now() - new Date(user.createdAt).getTime();
  const hasLink = /https?:\/\//i.test(req.body.content || '') || !!(req as any).file;
  if (ipHits >= 2 || (ageMs < 24 * 60 * 60 * 1000 && hasLink)) {
    const token = req.body.hCaptchaToken;
    if (!token) return res.status(400).json({ error: 'hCaptcha required' });
    try {
      const resp = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `response=${token}&secret=${process.env.HCAPTCHA_SECRET}`,
      });
      const data = await resp.json();
      if (!data.success) return res.status(400).json({ error: 'Invalid hCaptcha' });
    } catch {
      return res.status(400).json({ error: 'Invalid hCaptcha' });
    }
  }
  next();
}

// --------------------- mongolianProfanity ---------------
export async function mongolianProfanity(req: Request, res: Response, next: NextFunction) {
  const content = req.body.content || '';
  if (!profanityList.some(r => r.test(content))) return next();
  const user = (req as any).user;
  user.strikes = (user.strikes || 0) + 1;
  await user.save();
  if (user.strikes === 1) {
    return res.status(200).json({ warning: true });
  }
  user.mutedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();
  return res.status(403).json({ error: 'Muted for 24h' });
}

// -------------------- toxicityModelHF -------------------
const toxicityPromise = pipeline('text-classification', 'papluca/xlm-roberta-base-toxicity');
export async function toxicityModelHF(req: Request, res: Response, next: NextFunction) {
  if (!req.body.content) return next();
  const classifier = await toxicityPromise;
  const result = await classifier(req.body.content);
  if (result[0]?.score > 0.85) return res.status(400).json({ error: 'Toxic content' });
  next();
}

// ----------------------- shadowBanCheck -----------------
export function shadowBanCheck(req: Request, _res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (user.trustScore < -20) (req as any).shadow = true;
  next();
}

// ------------------------- canPost ----------------------
export function canPost(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (user.mutedUntil && new Date(user.mutedUntil) > new Date()) {
    return res.status(403).json({ error: 'Muted' });
  }
  next();
}
