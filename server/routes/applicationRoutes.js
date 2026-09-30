import express from 'express';
import {
  applyJob,
  getMyApplications,
  getApplicantsByJob,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/apply/:jobId', protect, authorize('student'), applyJob);
router.get('/my-applications', protect, authorize('student'), getMyApplications);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getApplicantsByJob);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

export default router;
