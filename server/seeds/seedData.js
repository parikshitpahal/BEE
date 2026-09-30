import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { ReferralRequest } from '../models/ReferralRequest.js';
import { CompanyReview } from '../models/CompanyReview.js';

export const seedDataIfEmpty = async () => {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log('[HireConnect Seed] Database already contains records. Skipping seed.');
    return;
  }

  console.log('[HireConnect Seed] Seeding fresh, rich demo data for all roles...');

  // 1. Create Users for all 4 roles
  const student = await User.create({
    name: 'Aarav Sharma',
    email: 'student@hireconnect.com',
    password: 'password123',
    role: 'student',
    headline: 'Pre-final Year B.Tech CSE | Full Stack Developer | Open Source Contributor',
    college: 'National Institute of Technology, Karnataka',
    branch: 'Computer Science and Engineering',
    cgpa: 8.92,
    gradYear: 2026,
    skills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Python', 'System Design'],
    github: 'https://github.com/aaravsharma',
    linkedin: 'https://linkedin.com/in/aaravsharma',
    resumeUrl: 'https://hireconnect.local/resumes/aarav-sharma-cv.pdf',
    bio: 'Passionate about building scalable distributed systems and developer tooling. Solved 350+ LeetCode problems.',
  });

  const recruiter = await User.create({
    name: 'Meera Iyer',
    email: 'recruiter@hireconnect.com',
    password: 'password123',
    role: 'recruiter',
    headline: 'Lead University Talent Acquisition @ Razorpay',
    company: 'Razorpay',
    designation: 'Senior Technical Recruiter',
    bio: 'Leading campus recruitment across Tier 1 & 2 engineering colleges for FY26 batch hiring.',
  });

  const recruiter2 = await User.create({
    name: 'David Chen',
    email: 'david@atlassian.com',
    password: 'password123',
    role: 'recruiter',
    headline: 'Early Career Campus Lead @ Atlassian',
    company: 'Atlassian',
    designation: 'Campus Hiring Partner',
  });

  const alumni1 = await User.create({
    name: 'Rohan Deshmukh',
    email: 'alumni@hireconnect.com',
    password: 'password123',
    role: 'alumni',
    headline: 'Software Engineer II @ Google | Ex-Amazon | Batch of 2023',
    currentCompany: 'Google',
    alumniRole: 'Software Engineer II (Core Infrastructure)',
    passoutYear: 2023,
    college: 'National Institute of Technology, Karnataka',
    branch: 'Computer Science and Engineering',
    isAvailableForReferral: true,
    isAvailableForMentorship: true,
    linkedin: 'https://linkedin.com/in/rohandesh',
    bio: 'Happy to review resumes and refer candidates with strong CS fundamentals and good problem-solving track record.',
  });

  const alumni2 = await User.create({
    name: 'Pooja Verma',
    email: 'pooja.alumni@hireconnect.com',
    password: 'password123',
    role: 'alumni',
    headline: 'Product Engineer @ Microsoft | Batch of 2022',
    currentCompany: 'Microsoft',
    alumniRole: 'Software Engineer II (Azure Cloud)',
    passoutYear: 2022,
    college: 'National Institute of Technology, Karnataka',
    branch: 'Information Technology',
    isAvailableForReferral: true,
    isAvailableForMentorship: true,
  });

  const alumni3 = await User.create({
    name: 'Vikram Joshi',
    email: 'vikram.alumni@hireconnect.com',
    password: 'password123',
    role: 'alumni',
    headline: 'Senior Backend Engineer @ Uber | Batch of 2021',
    currentCompany: 'Uber',
    alumniRole: 'Senior SDE (Mobility Core)',
    passoutYear: 2021,
    college: 'National Institute of Technology, Karnataka',
    branch: 'Electronics & Communication',
    isAvailableForReferral: true,
    isAvailableForMentorship: false,
  });

  const admin = await User.create({
    name: 'Prof. K. Venkatesh',
    email: 'admin@hireconnect.com',
    password: 'password123',
    role: 'admin',
    headline: 'Dean of Career Guidance & Placement Cell',
    designation: 'Placement Director',
    college: 'National Institute of Technology, Karnataka',
  });

  // 2. Create Jobs
  const job1 = await Job.create({
    title: 'Graduate Software Development Engineer (SDE-1)',
    company: 'Razorpay',
    description: 'Join the Payments Core team to architect high-throughput transaction pipelines processing over 250M transactions monthly. You will build resilient microservices in Go & Node.js, optimize low-latency database queries, and scale payment orchestration.',
    roleType: 'Full-Time',
    qualifications: ['B.Tech / B.E in CS / IT / ECE', 'Strong foundations in Data Structures & OOPs', 'No active backlogs'],
    skillsRequired: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'Kafka', 'System Design'],
    location: 'Bengaluru, India',
    workMode: 'Hybrid',
    ctc: '₹24 LPA - ₹28 LPA',
    cgpaCutoff: 7.5,
    eligibleBranches: ['CSE', 'IT', 'ECE', 'EEE'],
    deadline: new Date(+new Date() + 10 * 24 * 60 * 60 * 1000),
    status: 'Open',
    recruiterId: recruiter._id,
  });

  const job2 = await Job.create({
    title: 'Associate Site Reliability Engineer (SRE)',
    company: 'Atlassian',
    description: 'Work with the Cloud Infrastructure engineering team powering Jira, Confluence, and Bitbucket. Responsible for telemetry, automated failovers, Kubernetes clusters, and incident remediation.',
    roleType: 'Full-Time',
    qualifications: ['B.Tech / M.Tech in CS or allied branches', 'Comfortable with Linux fundamentals and networking'],
    skillsRequired: ['Kubernetes', 'Docker', 'AWS', 'Python', 'Terraform', 'Linux'],
    location: 'Bengaluru, India',
    workMode: 'Remote',
    ctc: '₹26 LPA - ₹32 LPA',
    cgpaCutoff: 7.0,
    eligibleBranches: ['CSE', 'IT', 'ECE'],
    deadline: new Date(+new Date() + 18 * 24 * 60 * 60 * 1000),
    status: 'Open',
    recruiterId: recruiter2._id,
  });

  const job3 = await Job.create({
    title: 'Frontend Platform Engineer',
    company: 'Razorpay',
    description: 'Craft high-performance, accessible, and type-safe merchant dashboards with React 19, TypeScript, and TailwindCSS. Build reusable micro-frontend design systems.',
    roleType: 'Full-Time',
    qualifications: ['B.Tech in CSE / IT / allied branches', 'Demonstrated portfolio of web applications'],
    skillsRequired: ['React', 'TypeScript', 'TailwindCSS', 'Next.js', 'Performance Optimization'],
    location: 'Bengaluru, India',
    workMode: 'On-site',
    ctc: '₹18 LPA - ₹22 LPA',
    cgpaCutoff: 7.0,
    eligibleBranches: ['All Branches'],
    deadline: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
    status: 'Open',
    recruiterId: recruiter._id,
  });

  const job4 = await Job.create({
    title: 'Systems & Cloud Intern (Summer 2026)',
    company: 'Uber',
    description: 'Join Uber Mobility engineering group for a 6-month intensive internship. Tackle distributed caching, map matching algorithms, and driver-dispatch telemetry.',
    roleType: 'Internship',
    qualifications: ['Graduating class of 2026', 'Strong problem solving in C++ or Java'],
    skillsRequired: ['Java', 'C++', 'Distributed Systems', 'Algorithms'],
    location: 'Hyderabad, India',
    workMode: 'Hybrid',
    ctc: '₹1.1 Lakh/month + Stipend',
    cgpaCutoff: 8.0,
    eligibleBranches: ['CSE', 'IT'],
    deadline: new Date(+new Date() + 5 * 24 * 60 * 60 * 1000),
    status: 'Open',
    recruiterId: recruiter._id,
  });

  // 3. Applications
  await Application.create({
    studentId: student._id,
    jobId: job1._id,
    status: 'Shortlisted',
    appliedAt: new Date(+new Date() - 3 * 24 * 60 * 60 * 1000),
    resumeUrl: 'https://hireconnect.local/resumes/aarav-sharma-cv.pdf',
    coverNote: 'Excited about Razorpay’s payment gateway infra. Built an open-source rate limiter and microservices in Go.',
    recruiterNotes: 'Exceptional project portfolio and clean GitHub commits. Shortlisted for Technical Round 1.',
  });

  await Application.create({
    studentId: student._id,
    jobId: job2._id,
    status: 'Applied',
    appliedAt: new Date(+new Date() - 1 * 24 * 60 * 60 * 1000),
    resumeUrl: 'https://hireconnect.local/resumes/aarav-sharma-cv.pdf',
    coverNote: 'Have deep interest in container orchestration and high availability architectures.',
  });

  // 4. Referral Requests
  await ReferralRequest.create({
    studentId: student._id,
    alumniId: alumni1._id,
    targetCompany: 'Google',
    jobRole: 'Software Engineer - Early Career (University Grad)',
    status: 'Accepted',
    note: 'Hi Rohan Bhaiya, I saw the Google University Graduate role opening (Req #G-9921). I have maintained an 8.92 CGPA and solved 350+ LeetCode problems. Would be grateful for a referral!',
    alumniResponse: 'Hey Aarav, profile looks solid. Submitted your internal referral via Google Staffing portal. Good luck!',
  });

  await ReferralRequest.create({
    studentId: student._id,
    alumniId: alumni2._id,
    targetCompany: 'Microsoft',
    jobRole: 'Software Engineer - Azure Core',
    status: 'Pending',
    note: 'Hello Pooja, I have built multiple cloud-native services with Docker and Node.js. Looking for guidance and a referral for the campus drive at Microsoft.',
  });

  // 5. Company Reviews & Interview Insights
  await CompanyReview.create({
    companyName: 'Razorpay',
    reviewerRole: 'Software Engineer I',
    authorId: alumni1._id,
    isAnonymous: true,
    overallRating: 5,
    difficultyLevel: 'Challenging',
    pros: 'Rapid engineering execution, massive transaction volume, high ownership for freshers, great developer culture.',
    cons: 'On-call shifts can be demanding during major festival sales events.',
    interviewRounds: 4,
    interviewQuestions: [
      'Design a scalable distributed rate-limiter with sliding window counter in Redis.',
      'Explain idempotency in payment transactions and how to prevent duplicate billing.',
      'Given an array of transaction timestamps, find maximum concurrent transactions within 60 seconds.',
    ],
    hiringProcessSummary: 'Online coding round (3 DSA questions) followed by 2 technical rounds (DSA + Low Level Design) and 1 Culture/Director round.',
    salaryRange: '₹22 LPA - ₹28 LPA',
    likesCount: 19,
  });

  await CompanyReview.create({
    companyName: 'Google',
    reviewerRole: 'Software Engineer II',
    authorId: alumni1._id,
    isAnonymous: true,
    overallRating: 5,
    difficultyLevel: 'Tough',
    pros: 'World-class engineering infrastructure, stellar work-life balance, unmatched mentorship.',
    cons: 'Promotions require thorough design doc reviews and cross-functional sign-offs.',
    interviewRounds: 5,
    interviewQuestions: [
      'Shortest path in a weighted grid with obstacles and dynamic fuel constraints.',
      'Design an LRU cache with eviction policies and multi-threaded synchronization.',
      'Behavioral: Tell me about a time you had a technical disagreement with a teammate.',
    ],
    hiringProcessSummary: 'Resume screening followed by 3 back-to-back algorithmic rounds and 1 Googleyness/Leadership interview.',
    salaryRange: '₹34 LPA - ₹45 LPA',
    likesCount: 42,
  });

  await CompanyReview.create({
    companyName: 'Atlassian',
    reviewerRole: 'Associate SRE',
    authorId: alumni2._id,
    isAnonymous: true,
    overallRating: 4,
    difficultyLevel: 'Medium',
    pros: 'Phenomenal remote-first culture, generous learning allowances, compassionate team members.',
    cons: 'Cross-timezone meetings with Sydney and Mountain View teams.',
    interviewRounds: 3,
    interviewQuestions: [
      'Troubleshoot a 504 Gateway Timeout between a reverse proxy and upstream service.',
      'Write a bash/python script to parse 10GB access logs and find top 5 erroneous IP addresses.',
    ],
    hiringProcessSummary: 'Karat screening test, 1 systems design / troubleshooting round, and 1 values & management discussion.',
    salaryRange: '₹26 LPA - ₹32 LPA',
    likesCount: 15,
  });

  console.log('[HireConnect Seed] Demo data seeded successfully!');
};
