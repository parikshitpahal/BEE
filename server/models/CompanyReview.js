import mongoose from 'mongoose';

const companyReviewSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    reviewerRole: {
      type: String,
      required: true,
      trim: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
    overallRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    difficultyLevel: {
      type: String,
      enum: ['Easy', 'Medium', 'Challenging', 'Tough'],
      default: 'Medium',
    },
    pros: {
      type: String,
      required: true,
    },
    cons: {
      type: String,
      required: true,
    },
    interviewRounds: {
      type: Number,
      default: 3,
    },
    interviewQuestions: [{ type: String }],
    hiringProcessSummary: {
      type: String,
      default: '',
    },
    salaryRange: {
      type: String,
      default: '₹12 - ₹18 LPA',
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const CompanyReview = mongoose.model('CompanyReview', companyReviewSchema);
