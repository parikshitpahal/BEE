import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, ExternalLink, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const ApplicantTracking = ({ defaultJobId }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(defaultJobId || '');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchApplicants(selectedJobId);
    }
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs/recruiter/my-jobs');
      if (res.data.success && res.data.data.length > 0) {
        setJobs(res.data.data);
        if (!selectedJobId) {
          setSelectedJobId(res.data.data[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplicants = async (jobId) => {
    setLoading(true);
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      if (res.data.success) {
        setApplicants(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const res = await api.put(`/applications/${applicationId}/status`, {
        status: newStatus,
        recruiterNotes: `Status changed to ${newStatus}`,
      });
      if (res.data.success) {
        setApplicants((prev) =>
          prev.map((a) => (a._id === applicationId ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      alert('Could not update status');
    }
  };

  const filteredApplicants = applicants.filter(
    (a) => statusFilter === 'All' || a.status === statusFilter
  );

  const getStatusBadge = (status) => {
    const map = {
      Applied: 'bg-blue-50 text-blue-700 border-blue-200',
      Reviewing: 'bg-amber-50 text-amber-700 border-amber-200',
      Shortlisted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      Interviewing: 'bg-purple-50 text-purple-700 border-purple-200',
      Selected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Rejected: 'bg-red-50 text-red-700 border-red-200',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${map[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Applicant Tracking System (ATS)</h1>
          <p className="text-xs text-gray-500 mt-0.5">Filter candidates, evaluate resumes, and manage recruitment pipeline</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {jobs.map((j) => (
              <option key={j._id} value={j._id}>
                {j.title} ({j.applicantCount || 0})
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="card-panel overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Candidate Pipeline</h2>
          <span className="text-xs text-gray-400">{filteredApplicants.length} candidates</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-gray-400">Loading candidates...</div>
        ) : filteredApplicants.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            <Users className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            No candidates found in this status category.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <th className="py-3 px-5 font-medium">Candidate</th>
                  <th className="py-3 px-4 font-medium">Academic Info</th>
                  <th className="py-3 px-4 font-medium">Resume & Note</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Pipeline Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplicants.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-gray-800">{app.studentId?.name}</div>
                      <div className="text-gray-400 text-[11px]">{app.studentId?.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-gray-700">{app.studentId?.branch}</div>
                      <div className="text-gray-400 text-[11px]">CGPA: <span className="font-semibold text-emerald-600">{app.studentId?.cgpa || '8.5'}</span></div>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px]">
                      {app.resumeUrl ? (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium text-xs mb-1"
                        >
                          <ExternalLink className="w-3 h-3" /> View Resume
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">No link</span>
                      )}
                      {app.coverNote && (
                        <p className="text-[11px] text-gray-500 truncate" title={app.coverNote}>
                          "{app.coverNote}"
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(app.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => handleStatusUpdate(app._id, 'Shortlisted')}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app._id, 'Selected')}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                          className="px-2 py-1 text-[11px] font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition"
                        >
                          Reject
                        </button>
                      </div>
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
