import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'recruiter', 'alumni', 'admin'],
      default: 'student',
    },
    // Common & Role-specific details
    headline: { type: String, default: '' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },

    // Student specific
    college: { type: String, default: 'Institute of Technology' },
    branch: { type: String, default: 'Computer Science & Engineering' },
    cgpa: { type: Number, default: 8.5 },
    gradYear: { type: Number, default: 2026 },
    resumeUrl: { type: String, default: '' },
    skills: [{ type: String }],
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },

    // Recruiter specific
    company: { type: String, default: '' },
    companyLogo: { type: String, default: '' },
    designation: { type: String, default: '' },

    // Alumni specific
    currentCompany: { type: String, default: '' },
    alumniRole: { type: String, default: '' },
    passoutYear: { type: Number, default: 2022 },
    isAvailableForReferral: { type: Boolean, default: true },
    isAvailableForMentorship: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
