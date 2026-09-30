import { CompanyReview } from '../models/CompanyReview.js';

// @desc Get company reviews and interview insights
// @route GET /api/reviews
export const getReviews = async (req, res) => {
  try {
    const { company, search } = req.query;
    let query = {};

    if (company) {
      query.companyName = new RegExp(company, 'i');
    }
    if (search) {
      query.$or = [
        { companyName: new RegExp(search, 'i') },
        { reviewerRole: new RegExp(search, 'i') },
        { pros: new RegExp(search, 'i') },
      ];
    }

    const reviews = await CompanyReview.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add a new company review / interview breakdown
// @route POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const {
      companyName,
      reviewerRole,
      isAnonymous,
      overallRating,
      difficultyLevel,
      pros,
      cons,
      interviewRounds,
      interviewQuestions,
      hiringProcessSummary,
      salaryRange,
    } = req.body;

    const review = await CompanyReview.create({
      companyName,
      reviewerRole,
      authorId: req.user._id,
      isAnonymous: isAnonymous !== undefined ? isAnonymous : true,
      overallRating: overallRating || 4,
      difficultyLevel: difficultyLevel || 'Medium',
      pros,
      cons,
      interviewRounds: interviewRounds || 3,
      interviewQuestions: interviewQuestions || [],
      hiringProcessSummary: hiringProcessSummary || '',
      salaryRange: salaryRange || '₹12 LPA - ₹18 LPA',
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Upvote/like a review
// @route POST /api/reviews/:id/like
export const likeReview = async (req, res) => {
  try {
    const review = await CompanyReview.findByIdAndUpdate(
      req.params.id,
      { $inc: { likesCount: 1 } },
      { new: true }
    );
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
