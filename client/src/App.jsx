import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';

import { StudentDashboard }   from './pages/StudentDashboard';
import { JobBoard }           from './pages/JobBoard';
import { AlumniNetwork }      from './pages/AlumniNetwork';
import { AICareerAssistant }  from './pages/AICareerAssistant';
import { CompanyInsights }    from './pages/CompanyInsights';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { ApplicantTracking }  from './pages/ApplicantTracking';
import { PostJob }            from './pages/PostJob';
import { AlumniInbox }        from './pages/AlumniInbox';
import { AddCompanyReview }   from './pages/AddCompanyReview';
import { AdminHub }           from './pages/AdminHub';

function AppContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);

  React.useEffect(() => {
    if (user) {
      if (user.role === 'recruiter')   setActiveTab('recruiter-jobs');
      else if (user.role === 'alumni') setActiveTab('alumni-inbox');
      else if (user.role === 'admin')  setActiveTab('admin-overview');
      else                             setActiveTab('dashboard');
    }
  }, [user?.role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
          Loading HireConnect…
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="border-b border-gray-200 bg-white py-3 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
            <span className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">HC</span>
            HireConnect
          </div>
          <span className="text-xs text-gray-400">Campus Placement & Alumni Gateway · 2026</span>
        </div>
        <AuthModal />
        <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-400 bg-white">
          HireConnect © 2026 — Built for University Placement Cells, Students & Alumni
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':              return <StudentDashboard onNavigate={setActiveTab} />;
      case 'jobs':                   return <JobBoard onNavigate={setActiveTab} />;
      case 'alumni':                 return <AlumniNetwork />;
      case 'ai-coach':               return <AICareerAssistant />;
      case 'reviews':                return <CompanyInsights onNavigate={setActiveTab} />;
      case 'recruiter-jobs':         return <RecruiterDashboard onNavigate={setActiveTab} onSelectJobForApplicants={setSelectedJobForApplicants} />;
      case 'recruiter-applicants':   return <ApplicantTracking defaultJobId={selectedJobForApplicants} />;
      case 'post-job':               return <PostJob onNavigate={setActiveTab} />;
      case 'alumni-inbox':           return <AlumniInbox />;
      case 'add-review':             return <AddCompanyReview onNavigate={setActiveTab} />;
      case 'admin-overview':
      case 'admin-users':            return <AdminHub />;
      default:                       return <StudentDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveView()}
      </main>
      <footer className="border-t border-gray-200 bg-white py-3 text-center text-xs text-gray-400">
        HireConnect · Campus Career Network · Multi-Role Platform
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
