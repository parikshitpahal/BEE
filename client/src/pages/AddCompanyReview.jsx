import React, { useState } from 'react';
import api from '../services/api';
import { Building2, ArrowLeft, Star, CheckCircle } from 'lucide-react';

export const AddCompanyReview = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    reviewerRole: 'Software Engineer',
    overallRating: 4,
    difficultyLevel: 'Medium',
    salaryRange: '₹14 - ₹18 LPA',
    interviewRounds: 3,
    interviewQuestions: '',
    pros: '',
    cons: '',
    isAnonymous: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        overallRating: Number(formData.overallRating),
        interviewRounds: Number(formData.interviewRounds),
        interviewQuestions: formData.interviewQuestions
          .split('\n')
          .map((q) => q.trim())
          .filter(Boolean),
      };

      const res = await api.post('/reviews', payload);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onNavigate('reviews');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('reviews')}
          className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Share Company Experience</h1>
          <p className="text-xs text-gray-500 mt-0.5">Help junior students prepare with real interview questions & insights</p>
        </div>
      </div>

      <div className="card-panel p-6 sm:p-8">
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Thank you! Your review has been published.
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
              <label className="block text-xs font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Google, Microsoft, Razorpay"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Role Interviewed For</label>
              <input
                type="text"
                name="reviewerRole"
                required
                value={formData.reviewerRole}
                onChange={handleChange}
                placeholder="e.g. SDE-1 / Product Analyst"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Overall Rating (1-5)</label>
              <select
                name="overallRating"
                value={formData.overallRating}
                onChange={handleChange}
                className="input-field"
              >
                <option value={5}>5 Stars - Excellent</option>
                <option value={4}>4 Stars - Good</option>
                <option value={3}>3 Stars - Average</option>
                <option value={2}>2 Stars - Below Average</option>
                <option value={1}>1 Star - Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Interview Difficulty</label>
              <select
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Challenging">Challenging</option>
                <option value="Tough">Tough</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Offered CTC / Range</label>
              <input
                type="text"
                name="salaryRange"
                required
                value={formData.salaryRange}
                onChange={handleChange}
                placeholder="e.g. ₹20 LPA"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Interview Questions Asked (One per line)
            </label>
            <textarea
              name="interviewQuestions"
              rows={4}
              required
              value={formData.interviewQuestions}
              onChange={handleChange}
              placeholder="Round 1: LRU cache implementation and complexity
Round 2: Designing a distributed rate limiter
Round 3: Past projects & conflict resolution"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Pros / Positive Highlights</label>
              <textarea
                name="pros"
                rows={3}
                required
                value={formData.pros}
                onChange={handleChange}
                placeholder="Helpful interviewers, clear problem statements..."
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Cons / Red Flags</label>
              <textarea
                name="cons"
                rows={3}
                required
                value={formData.cons}
                onChange={handleChange}
                placeholder="Long waiting gaps between rounds, vague feedback..."
                className="input-field"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isAnonymous"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isAnonymous" className="text-xs text-gray-600">
              Post anonymously (recommended to protect privacy)
            </label>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('reviews')}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs"
            >
              {loading ? 'Submitting...' : 'Post Insights'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
