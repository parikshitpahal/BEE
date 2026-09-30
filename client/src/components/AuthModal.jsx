import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, GraduationCap, Building, User, ShieldCheck, Lock, Mail } from 'lucide-react';

export const AuthModal = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [company, setCompany]   = useState('');
  const [branch, setBranch]     = useState('Computer Science');
  const [gradYear, setGradYear] = useState('2026');

  const demoAccounts = [
    { role: 'student',   email: 'student@hireconnect.com',   label: 'Student — Aarav Sharma (CGPA 8.92)',        icon: GraduationCap },
    { role: 'recruiter', email: 'recruiter@hireconnect.com', label: 'Recruiter — Meera Iyer, Razorpay',          icon: Building },
    { role: 'alumni',    email: 'alumni@hireconnect.com',    label: 'Alumni — Rohan Deshmukh, Google SWE II',    icon: User },
    { role: 'admin',     email: 'admin@hireconnect.com',     label: 'Admin — Prof. K. Venkatesh, Placement Cell', icon: ShieldCheck },
  ];

  const handleQuickLogin = async (demoEmail) => {
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, 'password123');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register({ name, email, password, role,
          company: role === 'recruiter' ? company : undefined,
          currentCompany: role === 'alumni' ? company : undefined,
          branch: role === 'student' ? branch : undefined,
          gradYear: role === 'student' ? Number(gradYear) : undefined,
        });
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-600 text-white mb-4 mx-auto shadow">
          <Briefcase className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome to HireConnect</h2>
        <p className="mt-1.5 text-sm text-gray-500 max-w-sm mx-auto">
          Campus placements, alumni mentorship, and AI-powered career guidance — all in one place.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="card-panel p-6 sm:p-8">

          {/* Demo accounts */}
          <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Quick Demo — 1-Click Login
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoAccounts.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleQuickLogin(item.email)}
                    disabled={loading}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-left rounded-lg bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 text-xs text-gray-700 transition group"
                  >
                    <Icon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span className="truncate font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">All demo passwords: <code className="font-mono bg-gray-100 px-1 rounded">password123</code></p>
          </div>

          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-xs text-gray-400">or use your credentials</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {error && (
            <div className="my-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Account Role</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['student', 'recruiter', 'alumni', 'admin'].map((r) => (
                      <button key={r} type="button" onClick={() => setRole(r)}
                        className={`py-1.5 text-xs font-medium rounded-md capitalize border transition ${
                          role === r ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sundaram"
                    className="input-field" />
                </div>
                {(role === 'recruiter' || role === 'alumni') && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {role === 'recruiter' ? 'Hiring Company' : 'Current Employer'}
                    </label>
                    <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Google, Microsoft"
                      className="input-field" />
                  </div>
                )}
                {role === 'student' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Branch</label>
                      <input type="text" value={branch} onChange={(e) => setBranch(e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Grad Year</label>
                      <input type="number" value={gradYear} onChange={(e) => setGradYear(e.target.value)} className="input-field" />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campus.edu"
                  className="input-field pl-9" />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-9" />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-2.5 text-xs font-semibold mt-1">
              {loading ? 'Signing in...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline">
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
