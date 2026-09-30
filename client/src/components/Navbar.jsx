import React, { useState } from 'react';
import {
  Briefcase, Users, MessageSquareCode, Building2,
  FileSpreadsheet, LogOut, Sparkles, Shield,
  Layers, Inbox, UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const getNavLinks = () => {
    if (!user) return [];
    switch (user.role) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Layers },
          { id: 'jobs', label: 'Placement Drives', icon: Briefcase },
          { id: 'alumni', label: 'Alumni & Referrals', icon: Users },
          { id: 'ai-coach', label: 'AI Career Coach', icon: Sparkles },
          { id: 'reviews', label: 'Company Reviews', icon: Building2 },
        ];
      case 'recruiter':
        return [
          { id: 'recruiter-jobs', label: 'Job Postings', icon: Briefcase },
          { id: 'recruiter-applicants', label: 'Applicant Tracking', icon: UserCheck },
          { id: 'post-job', label: 'Post Placement', icon: FileSpreadsheet },
        ];
      case 'alumni':
        return [
          { id: 'alumni-inbox', label: 'Referral Inbox', icon: Inbox },
          { id: 'add-review', label: 'Share Experience', icon: Building2 },
          { id: 'reviews', label: 'Campus Insights', icon: Briefcase },
        ];
      case 'admin':
        return [
          { id: 'admin-overview', label: 'Placement Hub', icon: Shield },
          { id: 'jobs', label: 'Manage Drives', icon: Briefcase },
          { id: 'admin-users', label: 'User Management', icon: Users },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const getRoleBadge = (role) => {
    const styles = {
      student:   'bg-blue-50 text-blue-700 border border-blue-200',
      recruiter: 'bg-amber-50 text-amber-700 border border-amber-200',
      alumni:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
      admin:     'bg-purple-50 text-purple-700 border border-purple-200',
    };
    const labels = { student: 'Student', recruiter: 'Recruiter', alumni: 'Alumni', admin: 'Admin' };
    return (
      <span className={`text-[11px] font-medium tracking-wide px-2 py-0.5 rounded ${styles[role] || ''}`}>
        {labels[role] || role}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-5">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm text-gray-900 tracking-tight">HireConnect</span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-0.5 pl-4 border-l border-gray-200">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs font-medium text-gray-800">{user.name}</span>
                {getRoleBadge(user.role)}
              </div>
              <p className="text-[11px] text-gray-400 truncate max-w-[180px]">
                {user.company || user.currentCompany || user.branch || user.email}
              </p>
            </div>

            <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center font-semibold text-xs text-indigo-700">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
