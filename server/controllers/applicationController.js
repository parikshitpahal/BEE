import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';

// @desc Apply for a job
// @route POST /api/applications/apply/:jobId
export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { resumeUrl, coverNote } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status !== 'Open') {
      return res.status(400).json({ success: false, message: 'This placement drive is closed' });
    }

    // Check if user already applied
    const existing = await Application.findOne({ studentId: req.user._id, jobId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied to this position' });
    }

    const application = await Application.create({
      studentId: req.user._id,
      jobId,
      resumeUrl: resumeUrl || req.user.resumeUrl || 'https://hireconnect.local/resumes/default-resume.pdf',
      coverNote: coverNote || '',
      status: 'Applied',
    });

    const populated = await Application.findById(application._id).populate('jobId');

    res.status(201).json({ success: true, message: 'Application submitted successfully', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get student's application history
// @route GET /api/applications/my-applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate('jobId')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all applicants for a specific job (Recruiter view)
// @route GET /api/applications/job/:jobId
export const getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Ensure only the job recruiter or admin can see applicants
    if (req.user.role !== 'admin' && job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view applicants for this job' });
    }

    const applications = await Application.find({ jobId })
      .populate('studentId', 'name email college branch cgpa gradYear resumeUrl skills phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update application status (Recruiter/Admin)
// @route PUT /api/applications/:id/status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, recruiterNotes } = req.body;
    const application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify recruiter rights
    if (req.user.role !== 'admin' && application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to change application status' });
    }

    if (status) application.status = status;
    if (recruiterNotes !== undefined) application.recruiterNotes = recruiterNotes;

    await application.save();

    res.json({ success: true, message: 'Application status updated', data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
