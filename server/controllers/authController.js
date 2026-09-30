import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secure_hireconnect_jwt_secret_token_2026_xyz!#', {
    expiresIn: '30d',
  });
};

// @desc Register user
// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, college, branch, gradYear, company, currentCompany, designation } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      college: college || 'National Institute of Technology',
      branch: branch || 'Computer Science',
      gradYear: gradYear || 2026,
      company: company || '',
      currentCompany: currentCompany || '',
      designation: designation || '',
      skills: ['JavaScript', 'React', 'Node.js', 'Data Structures', 'System Design'],
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        headline: user.headline,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          headline: user.headline,
          college: user.college,
          branch: user.branch,
          cgpa: user.cgpa,
          company: user.company,
          currentCompany: user.currentCompany,
          resumeUrl: user.resumeUrl,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get current profile
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Do not update password through this route
    delete updates.role; // Role modification restricted

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc List alumni for directory
// @route GET /api/auth/alumni
export const getAlumniDirectory = async (req, res) => {
  try {
    const { company, search } = req.query;
    let query = { role: 'alumni' };

    if (company) {
      query.currentCompany = new RegExp(company, 'i');
    }
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { currentCompany: new RegExp(search, 'i') },
        { alumniRole: new RegExp(search, 'i') },
      ];
    }

    const alumni = await User.find(query).select('-password').sort({ passoutYear: -1 });
    res.json({ success: true, count: alumni.length, data: alumni });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
