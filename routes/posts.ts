import { Router } from 'express';
import multer from 'multer';
import {
  verifyJWT,
  rateLimiter,
  youngAccountThrottle,
  hCaptchaFallback,
  mongolianProfanity,
  toxicityModelHF,
  shadowBanCheck,
  canPost,
} from '../middleware/postGuards';
import {
  createPost,
  likePost,
  commentPost,
  sharePost,
  reportPost,
} from '../controllers/posts';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post(
  '/',
  verifyJWT,
  rateLimiter,
  youngAccountThrottle,
  hCaptchaFallback,
  mongolianProfanity,
  toxicityModelHF,
  shadowBanCheck,
  canPost,
  upload.single('image'),
  createPost
);

router.post('/:id/like', verifyJWT, likePost);
router.post('/:id/comment', verifyJWT, commentPost);
router.post('/:id/share', verifyJWT, sharePost);
router.post('/:id/report', verifyJWT, reportPost);

export default router;
