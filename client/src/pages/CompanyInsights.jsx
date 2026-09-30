import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Building2, Star, ThumbsUp, Search, Plus, ShieldCheck } from 'lucide-react';

export const CompanyInsights = ({ onNavigate }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchReviews(); }, [searchTerm]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews', { params: { search: searchTerm } });
      if (res.data.success) setReviews(res.data.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const handleLike = async (id) => {
    try {
      const res = await api.post(`/reviews/${id}/like`);
      if (res.data.success) setReviews(p => p.map(r => r._id === id ? { ...r, likesCount: res.data.data.likesCount } : r));
    } catch { /* silent */ }
  };

  const difficultyColor = { Easy: 'bg-emerald-50 text-emerald-700 border border-emerald-200', Medium: 'bg-blue-50 text-blue-700 border border-blue-200', Challenging: 'bg-amber-50 text-amber-700 border border-amber-200', Tough: 'bg-red-50 text-red-700 border border-red-200' };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Company Insights & Interview Experiences</h1>
          <p className="text-xs text-gray-500 mt-0.5">Real interview questions and salary benchmarks from campus alumni</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input type="text" placeholder="Search company or role…" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-52" />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
          {(user?.role === 'alumni' || user?.role === 'admin') && (
            <button onClick={() => onNavigate('add-review')} className="btn-primary text-xs py-1.5">
              <Plus className="w-3.5 h-3.5" /> Post Review
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="card-panel p-10 text-center text-xs text-gray-400">Loading reviews…</div>
        ) : reviews.length === 0 ? (
          <div className="card-panel p-10 text-center text-xs text-gray-400">No insights found.</div>
        ) : reviews.map((rev) => (
          <div key={rev._id} className="card-panel p-5 sm:p-6 space-y-4">
            {/* Card header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-gray-900">{rev.companyName}</h2>
                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-gray-500">{rev.reviewerRole}</p>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${difficultyColor[rev.difficultyLevel] || 'bg-gray-100 text-gray-600'}`}>
                      {rev.difficultyLevel}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < rev.overallRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded font-mono">{rev.salaryRange}</span>
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="font-semibold text-emerald-700 block mb-1">Pros</span>
                <p className="text-gray-700 leading-relaxed">{rev.pros}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <span className="font-semibold text-red-700 block mb-1">Cons</span>
                <p className="text-gray-700 leading-relaxed">{rev.cons}</p>
              </div>
            </div>

            {/* Interview questions */}
            {rev.interviewQuestions?.length > 0 && (
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Interview Questions Asked — {rev.interviewRounds} Rounds
                </p>
                <ol className="space-y-1.5 text-xs text-gray-700 list-none">
                  {rev.interviewQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-500 font-semibold text-[11px] flex-shrink-0">Q{i+1}</span>
                      <span className="font-mono text-[11px]">{q}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span>Posted {rev.isAnonymous ? 'anonymously' : 'by alumni'} · {new Date(rev.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
              <button onClick={() => handleLike(rev._id)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 transition text-gray-500">
                <ThumbsUp className="w-3 h-3" /> Helpful ({rev.likesCount || 0})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
