import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, GraduationCap, Send, CheckCircle } from 'lucide-react';

export const AlumniNetwork = () => {
  const { user } = useAuth();
  const [alumniList, setAlumniList] = useState([]);
  const [myReferrals, setMyReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [targetAlumni, setTargetAlumni] = useState(null);
  const [referralCompany, setReferralCompany] = useState('');
  const [jobRole, setJobRole] = useState('Software Development Engineer');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => { fetchData(); }, [searchTerm, selectedCompany]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aRes, rRes] = await Promise.all([
        api.get('/auth/alumni', { params: { search: searchTerm, company: selectedCompany === 'All' ? undefined : selectedCompany } }),
        user?.role === 'student' ? api.get('/referrals/student') : Promise.resolve({ data: { data: [] } }),
      ]);
      if (aRes.data.success) setAlumniList(aRes.data.data);
      if (rRes.data?.success) setMyReferrals(rRes.data.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const openModal = (alumni) => {
    setTargetAlumni(alumni);
    setReferralCompany(alumni.currentCompany || '');
    setNote(`Hi ${alumni.name.split(' ')[0]}, I am a ${user?.branch} student at ${user?.college}. I'd love to request a referral for the ${jobRole} role at ${alumni.currentCompany}.`);
    setSuccessMsg('');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/referrals/request', { alumniId: targetAlumni._id, targetCompany: referralCompany, jobRole, note });
      if (res.data.success) {
        setSuccessMsg(`Referral request sent to ${targetAlumni.name}!`);
        setMyReferrals(p => [res.data.data, ...p]);
        setTimeout(() => { setTargetAlumni(null); setSuccessMsg(''); }, 2000);
      }
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const statusStyle = {
    Accepted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Referred:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Declined:  'bg-red-50 text-red-700 border border-red-200',
    Pending:   'bg-amber-50 text-amber-700 border border-amber-200',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Alumni Network & Referrals</h1>
          <p className="text-xs text-gray-500 mt-0.5">Connect with seniors at top companies for referrals and mentorship</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <input type="text" placeholder="Search alumni or role…" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-52" />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
          <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="All">All Companies</option>
            {['Google','Microsoft','Uber','Razorpay'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Student referral tracker */}
      {user?.role === 'student' && myReferrals.length > 0 && (
        <div className="card-panel p-5">
          <div className="flex items-center gap-2 mb-3">
            <Send className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-semibold text-gray-800">My Referral Requests</h2>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">{myReferrals.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myReferrals.map((ref) => (
              <div key={ref._id} className="p-3.5 rounded-lg border border-gray-200 bg-gray-50 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-gray-800">{ref.targetCompany} · {ref.jobRole}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${statusStyle[ref.status] || ''}`}>{ref.status}</span>
                </div>
                <p className="text-gray-500 text-[11px]">Sent to: <span className="text-gray-700 font-medium">{ref.alumniId?.name}</span> ({ref.alumniId?.currentCompany})</p>
                {ref.alumniResponse && (
                  <div className="mt-2 p-2 rounded bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-700">
                    <span className="font-semibold block">Alumni replied:</span>{ref.alumniResponse}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alumni grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full card-panel p-10 text-center text-xs text-gray-400">Loading alumni…</div>
        ) : alumniList.length === 0 ? (
          <div className="col-span-full card-panel p-10 text-center text-xs text-gray-400">No alumni found.</div>
        ) : alumniList.map((alumni) => (
          <div key={alumni._id} className="card-panel p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-sm text-indigo-700">
                    {alumni.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{alumni.name}</p>
                    <p className="text-[11px] text-indigo-600 font-medium">{alumni.currentCompany}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">'{String(alumni.passoutYear).slice(2)}</span>
              </div>

              <p className="text-[11px] text-gray-700 font-medium leading-relaxed">{alumni.alumniRole || alumni.headline}</p>
              <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                <GraduationCap className="w-3 h-3" />{alumni.branch} · {alumni.college}
              </p>

              {alumni.bio && (
                <p className="mt-2.5 text-[11px] text-gray-500 bg-gray-50 border border-gray-200 p-2.5 rounded-lg line-clamp-2 italic">"{alumni.bio}"</p>
              )}
            </div>

            <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Open to Referrals
              </span>
              {user?.role === 'student' && (
                <button onClick={() => openModal(alumni)} className="btn-primary text-xs py-1.5 px-3">
                  <Send className="w-3 h-3" /> Request
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Referral modal */}
      {targetAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="card-panel max-w-lg w-full p-6 shadow-xl">
            <h2 className="text-base font-bold text-gray-900 mb-0.5">Request Referral from {targetAlumni.name}</h2>
            <p className="text-xs text-gray-500 mb-4">{targetAlumni.alumniRole} @ {targetAlumni.currentCompany}</p>

            {successMsg ? (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />{successMsg}
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Target Company</label>
                    <input type="text" required value={referralCompany} onChange={(e) => setReferralCompany(e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Target Role</label>
                    <input type="text" required value={jobRole} onChange={(e) => setJobRole(e.target.value)} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Introduction Message</label>
                  <textarea rows={4} required value={note} onChange={(e) => setNote(e.target.value)} className="input-field" />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setTargetAlumni(null)} className="btn-secondary text-xs">Cancel</button>
                  <button type="submit" disabled={submitting} className="btn-primary text-xs">
                    {submitting ? 'Sending…' : 'Send Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
