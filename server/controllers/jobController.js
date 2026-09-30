import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';

// @desc Get all jobs with filters (student/all)
// @route GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    const { search, location, workMode, roleType } = req.query;
    let query = { status: 'Open' };

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') },
        { skillsRequired: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    if (location && location !== 'All') {
      query.location = new RegExp(location, 'i');
    }
    if (workMode && workMode !== 'All') {
      query.workMode = workMode;
    }
    if (roleType && roleType !== 'All') {
      query.roleType = roleType;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    // If student user is logged in, attach application status
    let userAppliedJobIds = [];
    if (req.user && req.user.role === 'student') {
      const applications = await Application.find({ studentId: req.user._id }).select('jobId status');
      userAppliedJobIds = applications.map((a) => ({ jobId: a.jobId.toString(), status: a.status }));
    }

    const enhancedJobs = jobs.map((job) => {
      const applied = userAppliedJobIds.find((a) => a.jobId === job._id.toString());
      return {
        ...job.toObject(),
        hasApplied: !!applied,
        applicationStatus: applied ? applied.status : null,
      };
    });

    res.json({ success: true, count: enhancedJobs.length, data: enhancedJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get job details by ID
// @route GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiterId', 'name email company');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create a new job posting (recruiter/admin)
// @route POST /api/jobs
export const createJob = async (req, res) => {
  try {
    const { title, company, description, qualifications, skillsRequired, location, workMode, ctc, cgpaCutoff, eligibleBranches, deadline } = req.body;

    const job = await Job.create({
      title,
      company: company || req.user.company || 'Campus Recruiter',
      description,
      qualifications: qualifications || ['B.Tech / B.E in CS / IT / ECE'],
      skillsRequired: skillsRequired || ['JavaScript', 'DSA', 'SQL'],
      location: location || 'Bengaluru, India',
      workMode: workMode || 'Hybrid',
      ctc: ctc || '₹14 LPA',
      cgpaCutoff: cgpaCutoff || 7.0,
      eligibleBranches: eligibleBranches || ['CSE', 'IT', 'ECE'],
      deadline: deadline || new Date(+new Date() + 14 * 24 * 60 * 60 * 1000),
      recruiterId: req.user._id,
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update job posting (recruiter/admin)
// @route PUT /api/jobs/:id
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (req.user.role !== 'admin' && job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get jobs created by current recruiter
// @route GET /api/jobs/recruiter/my-jobs
export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 });
    
    // Attach applicant counts
    const jobsWithMetrics = await Promise.all(
      jobs.map(async (job) => {
        const totalApplicants = await Application.countDocuments({ jobId: job._id });
        const shortlisted = await Application.countDocuments({ jobId: job._id, status: 'Shortlisted' });
        return {
          ...job.toObject(),
          totalApplicants,
          shortlisted,
        };
      })
    );

    res.json({ success: true, data: jobsWithMetrics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
