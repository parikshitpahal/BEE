# HireConnect — Smart Campus Placement & Career Guidance Platform

HireConnect is a production-ready, high-performance **MERN (MongoDB, Express.js, React.js, Node.js)** campus recruitment management system and career guidance platform designed specifically for university placement cells, graduating students, recruiters, and alumni networks.

---

## 1. Clean, High-Density SaaS UI/UX Design
The interface is engineered with a modern, human-designed aesthetic inspired by developer tools like Linear, GitHub, and Vercel:
- **Disciplined Palette**: Neutral slate surfaces (`#090d16`, `#0f172a`, `#1e293b`), crisp border dividers (`#334155`), and targeted Indigo accents (`#4f46e5`, `#6366f1`).
- **High Information Density**: Structured candidate tables, quick status badges (`Applied`, `Shortlisted`, `Selected`, `Rejected`), real-time search filters, and responsive split-view job drawers.
- **Fast Role Switching**: 1-click instant login buttons on the login screen for testing **Student**, **Recruiter**, **Alumni**, and **Admin (Director)** roles.

---

## 2. System Architecture & Tech Stack

```
hireconnect/
├── client/                     # React 18 + Vite + Tailwind CSS + Lucide Icons
│   ├── src/
│   │   ├── components/         # Navbar, AuthModal, Reusable UI
│   │   ├── context/            # AuthContext (JWT & Role session management)
│   │   ├── pages/
│   │   │   ├── StudentDashboard.jsx     # Overview, metrics, live application feed
│   │   │   ├── JobBoard.jsx             # Placement drives, search, 1-click apply
│   │   │   ├── AlumniNetwork.jsx        # Verified alumni directory & referral dispatcher
│   │   │   ├── AICareerAssistant.jsx    # GPT-fine-tuned campus interview & resume assistant
│   │   │   ├── CompanyInsights.jsx      # Anonymous interview questions & salary data
│   │   │   ├── RecruiterDashboard.jsx   # Drive lifecycle management & applicant counts
│   │   │   ├── ApplicantTracking.jsx    # ATS table, resume inspection, stage shortlisting
│   │   │   ├── PostJob.jsx              # Campus drive configuration form
│   │   │   ├── AlumniInbox.jsx          # Alumni referral review inbox & feedback
│   │   │   ├── AddCompanyReview.jsx     # Experience submission form
│   │   │   └── AdminHub.jsx             # Placement Director analytics & audit logs
│   │   └── services/           # Axios API instance with Bearer token injection
│   └── package.json
│
└── server/                     # Node.js + Express.js REST API
    ├── config/db.js            # Auto-recovering DB (MongoDB or fallback MongoMemoryServer)
    ├── controllers/            # authController, jobController, applicationController, etc.
    ├── middleware/auth.js      # JWT token verification & role-based RBAC middleware
    ├── models/                 # Mongoose models: User, Job, Application, ReferralRequest, CompanyReview
    ├── routes/                 # Express route handlers
    ├── seeds/seedData.js       # Auto-populates rich initial demo accounts & drives
    └── server.js               # Entrypoint with request logging & error handling
```

---

## 3. Database Schemas (Mongoose)

1. **`User`**:
   - `name`, `email`, `password` (bcrypt salted & hashed), `role` (`student | recruiter | alumni | admin`)
   - `headline`, `college`, `branch`, `cgpa`, `gradYear`, `skills`, `resumeUrl`
   - `company`, `designation` (Recruiters)
   - `currentCompany`, `alumniRole`, `passoutYear`, `isAvailableForReferral` (Alumni)

2. **`Job`**:
   - `title`, `company`, `description`, `roleType` (`Full-Time | Internship`)
   - `ctc`, `cgpaCutoff`, `eligibleBranches`, `skillsRequired`, `location`, `workMode`, `deadline`, `status`
   - `recruiterId` (Mongoose ObjectId ref)

3. **`Application`**:
   - `studentId`, `jobId`, `resumeUrl`, `coverNote`, `recruiterNotes`
   - `status` (`Applied | Reviewing | Shortlisted | Interviewing | Selected | Rejected`)
   - Unique composite index on `(studentId, jobId)` preventing duplicate submissions.

4. **`ReferralRequest`**:
   - `studentId`, `alumniId`, `targetCompany`, `jobRole`, `note`, `alumniResponse`
   - `status` (`Pending | Accepted | Referred | Declined`)

5. **`CompanyReview`**:
   - `companyName`, `reviewerRole`, `authorId`, `isAnonymous`
   - `overallRating`, `difficultyLevel`, `pros`, `cons`, `interviewRounds`, `interviewQuestions`, `salaryRange`, `likesCount`

---

## 4. Built-in Demo Credentials

| Role | Email | Password | Notable Features |
| :--- | :--- | :--- | :--- |
| **Student** | `student@hireconnect.com` | `password123` | Aarav Sharma (8.92 CGPA, CS) — Track drives, 1-click apply, AI Coach |
| **Recruiter** | `recruiter@hireconnect.com` | `password123` | Meera Iyer (Razorpay Talent) — Create drives, inspect resumes, ATS status updates |
| **Alumni** | `alumni@hireconnect.com` | `password123` | Rohan Deshmukh (Google SWE II) — Referral inbox, respond with notes, review drives |
| **Admin** | `admin@hireconnect.com` | `password123` | Prof. K. Venkatesh (Placement Director) — University metrics, placement conversion |

---

## 5. Running the Application

### Backend:
```bash
cd server
npm install
npm run dev    # Starts on http://localhost:5000 with auto-seeding
```

### Frontend:
```bash
cd client
npm install
npm run dev    # Starts on http://localhost:3000 with proxy to Express backend
```
