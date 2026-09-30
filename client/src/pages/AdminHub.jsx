import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShieldCheck, Users, Briefcase, Award, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const AdminHub = () => {
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [mRes, uRes] = await Promise.all([
        api.get('/admin/metrics'),
        api.get('/admin/users'),
      ]);
      if (mRes.data.success) setMetrics(mRes.data.data);
      if (uRes.data.success) setUsers(uRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      student: 'bg-blue-50 text-blue-700 border-blue-200',
      recruiter: 'bg-amber-50 text-amber-700 border-amber-200',
      alumni: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      admin: 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return (
      <span className={`text-[11px] font-medium px-2 py-0.5 rounded border capitalize ${styles[role] || 'bg-gray-100 text-gray-700'}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Placement Cell Administration</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor university-wide campus placement conversion, user verification, and recruitment logs
          </p>
        </div>

        <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
              activeTab === 'overview'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Placement Metrics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
              activeTab === 'users'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            User Management ({users.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card-panel p-12 text-center text-xs text-gray-400">Loading placement hub data...</div>
      ) : activeTab === 'overview' ? (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-panel p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Registered</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{metrics?.totalUsers || 0}</p>
                <p className="text-[11px] text-gray-400 mt-1">{metrics?.studentCount || 0} Students</p>
              </div>
              <div className="p-2.5 rounded-lg bg-indigo-50">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
            </div>

            <div className="card-panel p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Active Campus Drives</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{metrics?.activeJobs || 0}</p>
                <p className="text-[11px] text-gray-400 mt-1">{metrics?.totalJobs || 0} Total Listings</p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50">
                <Briefcase className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            <div className="card-panel p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{metrics?.totalApplications || 0}</p>
                <p className="text-[11px] text-emerald-600 mt-1">{metrics?.selectedCount || 0} Placed</p>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50">
                <ArrowUpRight className="w-5 h-5 text-amber-600" />
              </div>
            </div>

            <div className="card-panel p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Avg CTC Offered</p>
                <p className="text-2xl font-bold text-indigo-600 mt-0.5">₹21.2 LPA</p>
                <p className="text-[11px] text-gray-400 mt-1">Highest: ₹44 LPA</p>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-50">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Recent Applications Feed */}
          <div className="card-panel overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">Recent Campus Submissions & Status</h2>
              <span className="text-xs text-gray-400">Live stream</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500">
                    <th className="py-3 px-5 font-medium">Candidate</th>
                    <th className="py-3 px-4 font-medium">Applied Drive</th>
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Current Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {metrics?.recentApplications?.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-gray-800">
                        {app.studentId?.name || 'Student Candidate'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-gray-800 font-medium">{app.jobId?.title}</div>
                        <div className="text-gray-400 text-[11px]">{app.jobId?.company}</div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400">
                        {new Date(app.appliedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* User Table */
        <div className="card-panel overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">Registered Platform Users</h2>
            <span className="text-xs text-gray-400">{users.length} members</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <th className="py-3 px-5 font-medium">Name & Email</th>
                  <th className="py-3 px-4 font-medium">Role</th>
                  <th className="py-3 px-4 font-medium">Affiliation / Branch</th>
                  <th className="py-3 px-4 font-medium">Registered Date</th>
                  <th className="py-3 px-4 font-medium text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-gray-800">{u.name}</div>
                      <div className="text-gray-400 text-[11px]">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {u.company || u.currentCompany || u.branch || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
