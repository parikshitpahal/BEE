import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Briefcase, Clock, CheckCircle2, Calendar,
  AlertCircle, FileText, Building, ChevronRight,
  TrendingUp, Award, Sparkles,
} from 'lucide-react';

export const StudentDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications/my-applications');
      if (res.data.success) setApplications(res.data.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status) => {
    const map = {
      Shortlisted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      Selected:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
      Applied:     'bg-blue-50   text-blue-700   border border-blue-200',
      Reviewing:   'bg-blue-50   text-blue-700   border border-blue-200',
      Rejected:    'bg-red-50    text-red-700    border border-red-200',
      Interviewing:'bg-amber-50  text-amber-700  border border-amber-200',
    };
    const icons = { Shortlisted: CheckCircle2, Selected: CheckCircle2, Rejected: AlertCircle };
    const Icon = icons[status] || Clock;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const shortlisted = applications.filter(a => ['Shortlisted','Selected'].includes(a.status)).length;
  const inReview    = applications.filter(a => ['Applied','Reviewing'].includes(a.status)).length;

  return (
    <div className="space-y-6">
      {/* Welcome banner — clean, flat */}
      <div className="card-panel p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-indigo-500">
        <div>
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Campus Drive Season 2026</p>
          <h1 className="text-xl font-bold text-gray-900">Welcome back, {user?.name || 'Student'}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {user?.branch} · {user?.college} · CGPA:&nbsp;
            <span className="font-semibold text-emerald-600">{user?.cgpa || 8.5}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onNavigate('jobs')} className="btn-primary text-xs">
            Browse Drives <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onNavigate('ai-coach')} className="btn-secondary text-xs">
            AI Coach
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Applications', value: applications.length, icon: Briefcase,   color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Shortlisted',  value: shortlisted,         icon: Award,       color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Under Review', value: inReview,            icon: Clock,       color: 'text-amber-600',  bg: 'bg-amber-50' },
          { label: 'Avg Package',  value: '₹18.4 LPA',        icon: TrendingUp,  color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="card-panel p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{m.label}</p>
                <p className={`text-2xl font-bold mt-0.5 ${m.color}`}>{m.value}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${m.bg}`}>
                <Icon className={`w-5 h-5 ${m.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application table */}
        <div className="lg:col-span-2 card-panel overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">My Applications</h2>
              <p className="text-xs text-gray-400 mt-0.5">Real-time status of submitted applications</p>
            </div>
            <button onClick={() => onNavigate('jobs')} className="text-xs text-indigo-600 hover:underline">
              Find more →
            </button>
          </div>

          {loading ? (
            <div className="p-10 text-center text-xs text-gray-400">Loading applications…</div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-9 h-9 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-500">No applications yet</p>
              <p className="text-xs text-gray-400 mt-1">Explore placement drives and apply with one click.</p>
              <button onClick={() => onNavigate('jobs')} className="btn-primary text-xs mt-4">
                View Placements
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500">
                    <th className="py-3 px-5 font-medium">Company & Role</th>
                    <th className="py-3 px-4 font-medium">CTC</th>
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-gray-800">{app.jobId?.title}</div>
                        <div className="text-gray-400 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3" />{app.jobId?.company}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 font-medium">{app.jobId?.ctc || '—'}</td>
                      <td className="py-3.5 px-4 text-gray-400">
                        {new Date(app.appliedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(app.status)}</td>
                      <td className="py-3.5 px-4 text-gray-400 max-w-[180px] truncate">
                        {app.recruiterNotes || <span className="italic text-gray-300">Pending</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card-panel p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Upcoming Deadlines</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Razorpay Coding Round', tag: '2 days left', tagColor: 'bg-red-50 text-red-700 border border-red-200', detail: 'Redis + Graph DSA · 90 min proctored test' },
                { label: 'Atlassian SRE PPT',     tag: 'Next Monday',  tagColor: 'bg-blue-50 text-blue-700 border border-blue-200', detail: 'Virtual PPT · Mandatory for applicants' },
              ].map((d) => (
                <div key={d.label} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-800">{d.label}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${d.tagColor}`}>{d.tag}</span>
                  </div>
                  <p className="text-[11px] text-gray-500">{d.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-panel p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Placement Checklist</h3>
            </div>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />Resume updated with GitHub projects</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />CGPA verified by Placement Cell</li>
              <li className="flex items-center gap-2 text-amber-700"><AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />Request alumni referral for Google drive</li>
            </ul>
            <button onClick={() => onNavigate('alumni')} className="mt-4 w-full btn-secondary text-xs">
              Browse Alumni Directory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
