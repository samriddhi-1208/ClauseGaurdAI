import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
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

  const handleDemoFill = () => {
    setEmail('tiwari.samriddhi12@gmail.com');
    setPassword('clauseguard123');
  };

  return (
    <div className="min-h-screen bg-[#F8F7F2] flex items-center justify-center p-6 font-sans text-[#18231C]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8 md:p-9 border border-[#DDDCD3] relative">
        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-2xl bg-[#3F6149] flex items-center justify-center text-white mx-auto mb-3.5 shadow-2xs">
            <Shield className="w-6 h-6 stroke-[2]" />
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-[#18231C] tracking-tight">
            Sign In to ClauseGuard AI
          </h1>
          <p className="text-xs text-[#5A665D] font-normal mt-1">
            Enterprise legal intelligence & contradiction analysis
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-[#F9DFDE] border border-[#F2CAC8] rounded-xl flex items-center gap-2.5 text-xs font-semibold text-[#B5413D]">
            <AlertCircle className="w-4 h-4 text-[#B5413D] shrink-0 stroke-[2]" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2E3731] mb-1.5">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C948C] absolute left-3.5 top-3.5 stroke-[1.8]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="counsel@lawfirm.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#DDDCD3] rounded-xl text-xs md:text-sm text-[#18231C] placeholder-[#8C948C] focus:outline-none focus:border-[#3F6149] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#2E3731]">Password</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C948C] absolute left-3.5 top-3.5 stroke-[1.8]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF9F5] border border-[#DDDCD3] rounded-xl text-xs md:text-sm text-[#18231C] placeholder-[#8C948C] focus:outline-none focus:border-[#3F6149] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#3F6149] hover:bg-[#34503C] text-white font-semibold text-xs md:text-sm rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            {!loading && <ArrowRight className="w-4 h-4 stroke-[2]" />}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#ECEAE2] flex items-center justify-between text-xs text-[#5A665D]">
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-[11px] font-medium text-[#3F6149] hover:underline"
          >
            Fill Demo Credentials
          </button>
          <Link to="/register" className="text-[11px] font-semibold text-[#18231C] hover:text-[#3F6149] transition-colors">
            Create an Account →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
