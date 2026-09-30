import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    roleType: {
      type: String,
      enum: ['Full-Time', 'Internship', 'Contract'],
      default: 'Full-Time',
    },
    qualifications: [{ type: String }],
    skillsRequired: [{ type: String }],
    location: {
      type: String,
      default: 'Bengaluru, India',
    },
    workMode: {
      type: String,
      enum: ['On-site', 'Hybrid', 'Remote'],
      default: 'Hybrid',
    },
    ctc: {
      type: String,
      default: '₹14 LPA - ₹22 LPA',
    },
    cgpaCutoff: {
      type: Number,
      default: 7.0,
    },
    eligibleBranches: [{ type: String }],
    deadline: {
      type: Date,
      default: () => new Date(+new Date() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Archived'],
      default: 'Open',
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model('Job', jobSchema);
