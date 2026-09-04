import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Scale, Lock, Mail, ArrowRight, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      const isDemo = searchParams.get('demo');
      if (isDemo) {
        navigate('/dashboard?demo=true');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-200/80 relative overflow-hidden">
        
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

        <div className="text-center mb-8 pt-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-blue-600/30">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-500 mt-1">Sign in to ClauseGuard AI legal intelligence workspace</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs font-medium text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@lawfirm.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <span className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer">Forgot?</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center space-y-3">
          <p className="text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Create Account
            </Link>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Encrypted Legal Intelligence Pipeline</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
