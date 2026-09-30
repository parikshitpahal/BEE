import express from 'express';
import {
  getReviews,
  createReview,
  likeReview,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', protect, authorize('alumni', 'student', 'admin'), createReview);
router.post('/:id/like', protect, likeReview);

export default router;
