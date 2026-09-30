import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Briefcase, Users, Plus, CheckCircle, Clock, MapPin } from 'lucide-react';

export const RecruiterDashboard = ({ onNavigate, onSelectJobForApplicants }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs/recruiter/my-jobs');
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
      const res = await api.put(`/jobs/${jobId}`, { status: nextStatus });
      if (res.data.success) {
        setJobs(jobs.map((j) => (j._id === jobId ? { ...j, status: nextStatus } : j)));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const totalApplicants = jobs.reduce((acc, curr) => acc + (curr.applicantCount || 0), 0);
  const activeDrives = jobs.filter((j) => j.status === 'Open').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Recruiter Drive Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage on-campus placement drives and review applications</p>
        </div>
        <button
          onClick={() => onNavigate('post-job')}
          className="btn-primary text-xs py-2 px-3 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Post New Drive
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-panel p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Active Drives</p>
            <p className="text-2xl font-bold text-indigo-600 mt-0.5">{activeDrives}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-50">
            <Briefcase className="w-5 h-5 text-indigo-600" />
          </div>
        </div>

        <div className="card-panel p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Total Applicants</p>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">{totalApplicants}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50">
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="card-panel p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Average CGPA Cutoff</p>
            <p className="text-2xl font-bold text-gray-800 mt-0.5">7.5</p>
          </div>
          <div className="p-2.5 rounded-lg bg-gray-100">
            <CheckCircle className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Job Postings Table */}
      <div className="card-panel overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Your Placement Listings</h2>
          <span className="text-xs text-gray-400">{jobs.length} postings</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-gray-400">Loading drives...</div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-9 h-9 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">No drives posted yet</p>
            <p className="text-xs text-gray-400 mt-1">Create your first campus hiring drive to start receiving student applications.</p>
            <button onClick={() => onNavigate('post-job')} className="btn-primary text-xs mt-4">
              Post Drive
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <th className="py-3 px-5 font-medium">Role Title</th>
                  <th className="py-3 px-4 font-medium">CTC</th>
                  <th className="py-3 px-4 font-medium">Mode</th>
                  <th className="py-3 px-4 font-medium">Cutoff</th>
                  <th className="py-3 px-4 font-medium">Applicants</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-gray-800">{job.title}</div>
                      <div className="text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {job.location} · {job.roleType}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-700">{job.ctc}</td>
                    <td className="py-3.5 px-4 text-gray-600">{job.workMode}</td>
                    <td className="py-3.5 px-4 text-gray-600 font-mono">{job.cgpaCutoff}+</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => {
                          onSelectJobForApplicants(job._id);
                          onNavigate('recruiter-applicants');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium text-xs transition"
                      >
                        <Users className="w-3 h-3" />
                        {job.applicantCount || 0} candidates
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                          job.status === 'Open'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(job._id, job.status)}
                        className="text-xs text-gray-600 hover:text-indigo-600 font-medium underline"
                      >
                        {job.status === 'Open' ? 'Close Drive' : 'Reopen'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
