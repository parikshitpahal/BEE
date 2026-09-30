import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, GraduationCap, CheckCircle, Building } from 'lucide-react';

export const JobBoard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleType, setSelectedRoleType] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [customResume, setCustomResume] = useState(user?.resumeUrl || '');

  useEffect(() => { fetchJobs(); }, [searchTerm, selectedRoleType, selectedWorkMode]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs', {
        params: { search: searchTerm, roleType: selectedRoleType, workMode: selectedWorkMode },
      });
      if (res.data.success) {
        setJobs(res.data.data);
        if (res.data.data.length > 0 && !selectedJob) setSelectedJob(res.data.data[0]);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;
    setApplying(true);
    try {
      const res = await api.post(`/applications/apply/${selectedJob._id}`, { resumeUrl: customResume, coverNote });
      if (res.data.success) {
        setApplySuccess('Application submitted successfully!');
        setJobs(prev => prev.map(j => j._id === selectedJob._id ? { ...j, hasApplied: true, applicationStatus: 'Applied' } : j));
        setSelectedJob(prev => ({ ...prev, hasApplied: true, applicationStatus: 'Applied' }));
        setTimeout(() => setApplySuccess(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit');
    } finally {
      setApplying(false);
    }
  };

  const workModeColor = { Hybrid: 'bg-blue-50 text-blue-700', Remote: 'bg-emerald-50 text-emerald-700', 'On-site': 'bg-gray-100 text-gray-700' };

  return (
    <div className="space-y-5">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Active Placement Drives</h1>
          <p className="text-xs text-gray-500 mt-0.5">Full-time campus offers and summer 2026 internships</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <input type="text" placeholder="Search role, company, skill…" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-56" />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
          <select value={selectedRoleType} onChange={(e) => setSelectedRoleType(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="All">All Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Internship">Internship</option>
          </select>
          <select value={selectedWorkMode} onChange={(e) => setSelectedWorkMode(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="All">All Modes</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
      </div>

      {/* Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Job list */}
        <div className="lg:col-span-5 space-y-2">
          {loading ? (
            <div className="card-panel p-8 text-center text-xs text-gray-400">Loading drives…</div>
          ) : jobs.length === 0 ? (
            <div className="card-panel p-8 text-center text-xs text-gray-400">No placements matching your filter.</div>
          ) : jobs.map((job) => {
            const isSelected = selectedJob?._id === job._id;
            return (
              <div key={job._id} onClick={() => setSelectedJob(job)}
                className={`card-panel p-4 cursor-pointer transition-all ${isSelected ? 'border-indigo-400 ring-1 ring-indigo-200 shadow-md' : 'hover:border-gray-300 hover:shadow-sm'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 leading-tight">{job.title}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{job.company}</p>
                    </div>
                  </div>
                  {job.hasApplied ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle className="w-3 h-3" /> {job.applicationStatus}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded whitespace-nowrap">
                      {job.ctc}
                    </span>
                  )}
                </div>

                <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${workModeColor[job.workMode] || 'bg-gray-100 text-gray-600'}`}>{job.workMode}</span>
                  <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{job.cgpaCutoff}+ CGPA</span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {job.skillsRequired?.slice(0, 3).map((s, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-mono">{s}</span>
                  ))}
                  {job.skillsRequired?.length > 3 && <span className="text-[10px] text-gray-400 self-center">+{job.skillsRequired.length - 3}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-7">
          {selectedJob ? (
            <div className="card-panel p-6 space-y-5">
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                      {selectedJob.roleType}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${workModeColor[selectedJob.workMode] || 'bg-gray-100 text-gray-600'}`}>
                      {selectedJob.workMode}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedJob.title}</h2>
                  <p className="text-sm text-gray-500">{selectedJob.company} · {selectedJob.location}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-emerald-600">{selectedJob.ctc}</div>
                  <p className="text-[11px] text-gray-400">Annual CTC</p>
                </div>
              </div>

              {applySuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />{applySuccess}
                </div>
              )}

              {/* Specs grid */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs">
                <div><span className="text-gray-400 block text-[11px]">Work Mode</span><span className="font-semibold text-gray-800">{selectedJob.workMode}</span></div>
                <div><span className="text-gray-400 block text-[11px]">Min CGPA</span><span className="font-semibold text-gray-800">{selectedJob.cgpaCutoff}</span></div>
                <div><span className="text-gray-400 block text-[11px]">Deadline</span><span className="font-semibold text-gray-800">{new Date(selectedJob.deadline).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</span></div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Role Overview</h3>
                <p className="text-xs text-gray-700 leading-relaxed">{selectedJob.description}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Requirements</h3>
                <ul className="space-y-1.5 text-xs text-gray-700">
                  {selectedJob.qualifications?.map((q, i) => (
                    <li key={i} className="flex items-start gap-2"><span className="text-indigo-500 font-bold">·</span>{q}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.skillsRequired?.map((s, i) => (
                    <span key={i} className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs border border-gray-200 font-mono">{s}</span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                {selectedJob.hasApplied ? (
                  <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      You've already applied for this position.
                    </div>
                    <button onClick={() => onNavigate('dashboard')} className="underline text-emerald-600 text-xs">View in Dashboard</button>
                  </div>
                ) : user?.role === 'student' ? (
                  <form onSubmit={handleApply} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">Resume URL</label>
                        <input type="text" required value={customResume} onChange={(e) => setCustomResume(e.target.value)}
                          placeholder="https://drive.google.com/…" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">Cover Note</label>
                        <input type="text" value={coverNote} onChange={(e) => setCoverNote(e.target.value)}
                          placeholder="Brief note on your fit…" className="input-field" />
                      </div>
                    </div>
                    <button type="submit" disabled={applying} className="w-full btn-primary py-2.5 text-xs font-semibold">
                      {applying ? 'Submitting…' : 'Submit Application'}
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-gray-400 italic">Sign in as a student to apply.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="card-panel p-12 text-center text-xs text-gray-400">Select a job to view details</div>
          )}
        </div>
      </div>
    </div>
  );
};
