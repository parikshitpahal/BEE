import express from 'express';
import {
  createReferralRequest,
  getStudentReferrals,
  getAlumniReferrals,
  respondToReferral,
} from '../controllers/referralController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/request', protect, authorize('student'), createReferralRequest);
router.get('/student', protect, authorize('student'), getStudentReferrals);
router.get('/alumni', protect, authorize('alumni', 'admin'), getAlumniReferrals);
router.put('/:id/respond', protect, authorize('alumni', 'admin'), respondToReferral);

export default router;
