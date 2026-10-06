import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Scale, Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
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
      setError('Please enter both work email and password.');
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
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] flex items-center justify-center p-6 font-sans text-slate-100">
      <div className="w-full max-w-md bg-[#111827] rounded-xl shadow-xl p-8 border border-slate-800 relative">
        <div className="text-center mb-7">
          <div className="w-11 h-11 rounded-lg bg-blue-600 flex items-center justify-center text-white mx-auto mb-3 shadow-xs">
            <Scale className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Sign In to ClauseGuard AI</h1>
          <p className="text-xs text-slate-400 font-normal mt-1">Enterprise legal intelligence & contradiction analysis</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-rose-950/50 border border-rose-800/60 rounded-lg flex items-center gap-2.5 text-xs font-medium text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="counsel@lawfirm.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors font-normal"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">Password</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors font-normal"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center space-y-3">
          <p className="text-xs text-slate-400 font-normal">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-medium text-blue-400 hover:underline">
              Register here
            </Link>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-normal">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Legal Workspace</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
