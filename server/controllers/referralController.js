import { ReferralRequest } from '../models/ReferralRequest.js';

// @desc Request referral from alumni
// @route POST /api/referrals/request
export const createReferralRequest = async (req, res) => {
  try {
    const { alumniId, targetCompany, jobRole, note } = req.body;

    if (!alumniId || !targetCompany || !note) {
      return res.status(400).json({ success: false, message: 'Alumni ID, company, and note are required' });
    }

    const request = await ReferralRequest.create({
      studentId: req.user._id,
      alumniId,
      targetCompany,
      jobRole: jobRole || 'Software Engineer',
      note,
      status: 'Pending',
    });

    const populated = await ReferralRequest.findById(request._id)
      .populate('alumniId', 'name email currentCompany alumniRole passoutYear')
      .populate('studentId', 'name email branch cgpa resumeUrl');

    res.status(201).json({ success: true, message: 'Referral request dispatched', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get student's sent referral requests
// @route GET /api/referrals/student
export const getStudentReferrals = async (req, res) => {
  try {
    const requests = await ReferralRequest.find({ studentId: req.user._id })
      .populate('alumniId', 'name email currentCompany alumniRole passoutYear')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get alumni's received referral requests
// @route GET /api/referrals/alumni
export const getAlumniReferrals = async (req, res) => {
  try {
    const requests = await ReferralRequest.find({ alumniId: req.user._id })
      .populate('studentId', 'name email branch cgpa gradYear resumeUrl skills phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update referral status (Alumni responding)
// @route PUT /api/referrals/:id/respond
export const respondToReferral = async (req, res) => {
  try {
    const { status, alumniResponse } = req.body;
    const request = await ReferralRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Referral request not found' });
    }

    if (request.alumniId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to respond to this request' });
    }

    if (status) request.status = status;
    if (alumniResponse !== undefined) request.alumniResponse = alumniResponse;

    await request.save();

    res.json({ success: true, message: 'Referral updated successfully', data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
