import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Inbox, CheckCircle, XCircle, ExternalLink, MessageSquare } from 'lucide-react';

export const AlumniInbox = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseStatus, setResponseStatus] = useState('Accepted');
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/referrals/alumni');
      if (res.data.success) {
        setReferrals(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResponse = (ref, status) => {
    setRespondingTo(ref);
    setResponseStatus(status);
    setResponseText(
      status === 'Accepted'
        ? `Happy to refer you for the ${ref.jobRole} position at ${ref.targetCompany}. I will submit your profile through our internal portal.`
        : `Thank you for reaching out. Unfortunately, our team is currently looking for profiles with specific stack experience. Keep in touch!`
    );
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.put(`/referrals/${respondingTo._id}/respond`, {
        status: responseStatus,
        response: responseText,
      });
      if (res.data.success) {
        setReferrals(
          referrals.map((r) =>
            r._id === respondingTo._id
              ? { ...r, status: responseStatus, alumniResponse: responseText }
              : r
          )
        );
        setRespondingTo(null);
      }
    } catch (err) {
      alert('Failed to send response');
    } finally {
      setSubmitting(false);
    }
  };

  const statusStyle = {
    Accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Referred: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Declined: 'bg-red-50 text-red-700 border-red-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Alumni Referral Requests</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Review student referral requests, evaluate credentials, and refer candidates to your company
        </p>
      </div>

      <div className="card-panel overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Incoming Requests</h2>
          <span className="text-xs text-gray-400">{referrals.length} total</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-gray-400">Loading referral inbox...</div>
        ) : referrals.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            <Inbox className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            No referral requests pending at the moment.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {referrals.map((req) => (
              <div key={req._id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{req.studentId?.name}</span>
                      <span className="text-xs text-gray-400">· {req.studentId?.branch}</span>
                      <span className="text-xs text-emerald-600 font-medium">CGPA: {req.studentId?.cgpa || '8.8'}</span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                          statusStyle[req.status] || 'bg-gray-100'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-700">
                      <span className="font-semibold text-indigo-600">Role Requested:</span> {req.jobRole} @ {req.targetCompany}
                    </div>

                    <p className="text-xs text-gray-600 bg-gray-50 border border-gray-200 p-3 rounded-lg leading-relaxed max-w-2xl">
                      "{req.note}"
                    </p>

                    {req.studentId?.resumeUrl && (
                      <a
                        href={req.studentId?.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline font-medium pt-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View Student Resume
                      </a>
                    )}

                    {req.alumniResponse && (
                      <div className="mt-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-md">
                        <span className="font-semibold block mb-0.5">Your Response:</span>
                        {req.alumniResponse}
                      </div>
                    )}
                  </div>

                  {req.status === 'Pending' && (
                    <div className="flex sm:flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleOpenResponse(req, 'Accepted')}
                        className="btn-primary text-xs py-1.5 px-3"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Accept & Refer
                      </button>
                      <button
                        onClick={() => handleOpenResponse(req, 'Declined')}
                        className="btn-secondary text-xs py-1.5 px-3 text-red-600 hover:bg-red-50 hover:border-red-200"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Response Dialog */}
      {respondingTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="card-panel max-w-lg w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Respond to {respondingTo.studentId?.name}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Status:{' '}
              <span className={responseStatus === 'Accepted' ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                {responseStatus}
              </span>
            </p>

            <form onSubmit={handleSubmitResponse} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Message for the student
                </label>
                <textarea
                  rows={4}
                  required
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRespondingTo(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs"
                >
                  {submitting ? 'Sending...' : 'Confirm Response'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
