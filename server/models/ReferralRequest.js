import mongoose from 'mongoose';

const referralRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    alumniId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetCompany: {
      type: String,
      required: true,
      trim: true,
    },
    jobRole: {
      type: String,
      default: 'Software Development Engineer',
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Referred', 'Declined'],
      default: 'Pending',
    },
    note: {
      type: String,
      required: true,
    },
    alumniResponse: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const ReferralRequest = mongoose.model('ReferralRequest', referralRequestSchema);
