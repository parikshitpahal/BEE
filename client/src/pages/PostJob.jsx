import React, { useState } from 'react';
import api from '../services/api';
import { Briefcase, ArrowLeft, CheckCircle } from 'lucide-react';

export const PostJob = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    title: '',
    roleType: 'Full-Time',
    workMode: 'Hybrid',
    location: 'Bengaluru, India',
    ctc: '',
    description: '',
    skillsRequired: '',
    qualifications: '',
    cgpaCutoff: 7.0,
    deadline: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        skillsRequired: formData.skillsRequired.split(',').map((s) => s.trim()).filter(Boolean),
        qualifications: formData.qualifications.split('\n').map((q) => q.trim()).filter(Boolean),
        cgpaCutoff: Number(formData.cgpaCutoff),
      };

      const res = await api.post('/jobs', payload);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onNavigate('recruiter-jobs');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish job posting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('recruiter-jobs')}
          className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Post Placement Drive</h1>
          <p className="text-xs text-gray-500 mt-0.5">Publish a campus hiring opportunity for eligible students</p>
        </div>
      </div>

      <div className="card-panel p-6 sm:p-8">
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Drive published successfully! Redirecting to dashboard...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Software Engineer (Backend)"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Annual CTC / Stipend</label>
              <input
                type="text"
                name="ctc"
                required
                value={formData.ctc}
                onChange={handleChange}
                placeholder="e.g. ₹18.0 - ₹24.0 LPA"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Role Type</label>
              <select
                name="roleType"
                value={formData.roleType}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Work Mode</label>
              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Minimum CGPA Cutoff</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                name="cgpaCutoff"
                required
                value={formData.cgpaCutoff}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Application Deadline</label>
              <input
                type="date"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Key Skills (Comma separated)</label>
            <input
              type="text"
              name="skillsRequired"
              required
              value={formData.skillsRequired}
              onChange={handleChange}
              placeholder="e.g. Node.js, React, MongoDB, System Design, DSA"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Job Description</label>
            <textarea
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Detail the responsibilities and team context..."
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Eligibility & Qualifications (One per line)
            </label>
            <textarea
              name="qualifications"
              rows={3}
              required
              value={formData.qualifications}
              onChange={handleChange}
              placeholder="B.Tech Computer Science / IT / ECE
No active backlogs
Solid foundation in algorithms and databases"
              className="input-field"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('recruiter-jobs')}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs"
            >
              {loading ? 'Publishing...' : 'Publish Campus Drive'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
