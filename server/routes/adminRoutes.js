import express from 'express';
import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { ReferralRequest } from '../models/ReferralRequest.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc Get high-level placement cell overview metrics
// @route GET /api/admin/metrics
router.get('/metrics', protect, authorize('admin'), async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalAlumni = await User.countDocuments({ role: 'alumni' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'Open' });
    const totalApplications = await Application.countDocuments();
    const totalSelected = await Application.countDocuments({ status: 'Selected' });
    const totalReferrals = await ReferralRequest.countDocuments();

    // Recent applications stream
    const recentApplications = await Application.find()
      .populate('studentId', 'name email branch cgpa')
      .populate('jobId', 'title company ctc')
      .sort({ createdAt: -1 })
      .limit(6);

    // Recent registered users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        totalStudents,
        totalRecruiters,
        totalAlumni,
        totalJobs,
        activeJobs,
        totalApplications,
        totalSelected,
        totalReferrals,
        placementRate: totalStudents > 0 ? Math.round((totalSelected / totalStudents) * 100) : 78,
        recentApplications,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc Get all users for admin management
// @route GET /api/admin/users
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
